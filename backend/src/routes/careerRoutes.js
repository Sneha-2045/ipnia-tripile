const express = require("express");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const CareerJob = require("../models/CareerJob");
const CareerApplication = require("../models/CareerApplication");
const { requireRecruiter } = require("../middleware/requireAuth");

const router = express.Router();
const applicationLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 8, standardHeaders: true, legacyHeaders: false, message: { success: false, message: "Too many applications from this connection. Please try again later." } });
const upload = express.raw({ type: "multipart/form-data", limit: "6mb" });
const allowedResumeTypes = new Map([["application/pdf", ".pdf"], ["application/msword", ".doc"], ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".docx"]]);

function fieldsFromMultipart(req, res, next) {
  upload(req, res, (error) => {
    if (error) return res.status(error.status === 413 ? 413 : 400).json({ success: false, message: error.status === 413 ? "Resume must be 5 MB or smaller." : "Invalid application upload." });
    try {
      const boundary = String(req.headers["content-type"] || "").match(/boundary=(?:"([^"]+)"|([^;]+))/i);
      if (!boundary || !Buffer.isBuffer(req.body)) throw new Error("Invalid multipart form.");
      const marker = Buffer.from(`--${boundary[1] || boundary[2]}`);
      const parts = [];
      let cursor = 0;
      while ((cursor = req.body.indexOf(marker, cursor)) !== -1) {
        cursor += marker.length;
        if (req.body.subarray(cursor, cursor + 2).toString() === "--") break;
        if (req.body.subarray(cursor, cursor + 2).toString() === "\r\n") cursor += 2;
        const headerEnd = req.body.indexOf(Buffer.from("\r\n\r\n"), cursor);
        if (headerEnd < 0) break;
        const headers = req.body.subarray(cursor, headerEnd).toString("utf8");
        const nextMarker = req.body.indexOf(marker, headerEnd + 4);
        if (nextMarker < 0) break;
        const value = req.body.subarray(headerEnd + 4, Math.max(headerEnd + 4, nextMarker - 2));
        const name = headers.match(/name="([^"]+)"/i)?.[1];
        const filename = headers.match(/filename="([^"]*)"/i)?.[1];
        if (name) parts.push({ name, filename, headers, value });
        cursor = nextMarker;
      }
      req.careerFields = {};
      for (const part of parts) {
        if (part.name === "resume" && part.filename) req.careerResume = part;
        else req.careerFields[part.name] = part.value.toString("utf8");
      }
      next();
    } catch (e) { return res.status(400).json({ success: false, message: e.message || "Invalid application form." }); }
  });
}

router.get("/jobs", async (req, res, next) => {
  try {
    const jobs = await CareerJob.find({ status: "published", $or: [{ applicationDeadline: null }, { applicationDeadline: { $gte: new Date() } }] }).select("-createdBy").sort({ createdAt: -1 }).lean();
    res.json({ success: true, jobs });
  } catch (e) { next(e); }
});

router.post("/applications", applicationLimiter, fieldsFromMultipart, async (req, res, next) => {
  try {
    const f = req.careerFields || {}; const resume = req.careerResume;
    const required = ["applicantName", "email", "phone", "currentLocation", "position", "department", "experience"];
    if (required.some((key) => !String(f[key] || "").trim()) || f.consent !== "on") return res.status(400).json({ success: false, message: "Complete the required fields and confirm privacy consent." });
    const email = String(f.email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ success: false, message: "Enter a valid email address." });
    if (!/^[+0-9() .-]{7,20}$/.test(String(f.phone))) return res.status(400).json({ success: false, message: "Enter a valid phone number." });
    if (!resume || !resume.value.length) return res.status(400).json({ success: false, message: "Attach your resume." });
    if (resume.value.length > 5 * 1024 * 1024) return res.status(413).json({ success: false, message: "Resume must be 5 MB or smaller." });
    const contentType = resume.headers.match(/content-type:\s*([^\r\n]+)/i)?.[1]?.trim().toLowerCase() || "";
    const filename = (resume.filename || "resume").replace(/[\\/\r\n]/g, "_");
    const ext = filename.toLowerCase().match(/\.(pdf|docx?)$/)?.[0];
    if (!ext || allowedResumeTypes.get(contentType) !== ext) return res.status(400).json({ success: false, message: "Resume must be a PDF, DOC or DOCX file." });
    const signatureOk = ext === ".pdf" ? resume.value.subarray(0, 5).toString() === "%PDF-" : ext === ".doc" ? resume.value.subarray(0, 4).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0])) : resume.value.subarray(0, 2).toString() === "PK";
    if (!signatureOk) return res.status(400).json({ success: false, message: "The resume file contents do not match its file type." });
    const slug = String(f.jobSlug || "").trim();
    let jobId = null;
    if (slug) {
      const job = await CareerJob.findOne({ slug, status: "published" });
      if (!job) return res.status(400).json({ success: false, message: "This vacancy is no longer accepting applications." });
      jobId = job._id;
    }
    const duplicateSince = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    if (await CareerApplication.exists({ email, jobSlug: slug, createdAt: { $gte: duplicateSince } })) return res.status(409).json({ success: false, message: "An application from this email for this role was already received recently." });
    const application = await CareerApplication.create({ applicantName: f.applicantName.trim(), email, phone: f.phone.trim(), currentLocation: f.currentLocation.trim(), jobId, jobSlug: slug, position: f.position.trim(), department: f.department.trim(), experience: f.experience.trim(), linkedinUrl: f.linkedinUrl || "", portfolioUrl: f.portfolioUrl || "", coverLetter: f.coverLetter || "", resume: { data: resume.value, contentType, fileName: filename }, consentAt: new Date() });
    if (process.env.RECRUITMENT_WEBHOOK_URL) {
      void fetch(process.env.RECRUITMENT_WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json", ...(process.env.RECRUITMENT_WEBHOOK_SECRET ? { Authorization: `Bearer ${process.env.RECRUITMENT_WEBHOOK_SECRET}` } : {}) }, body: JSON.stringify({ event: "career_application_received", applicationId: String(application._id), position: application.position, department: application.department, appliedAt: application.createdAt }) }).catch((e) => console.error("[careers] notification delivery failed", e.message));
    }
    return res.status(201).json({ success: true, applicationId: String(application._id), message: "Application received." });
  } catch (e) { next(e); }
});

router.use("/admin", requireRecruiter);
router.get("/admin/jobs", async (req, res, next) => { try { const jobs = await CareerJob.find().sort({ updatedAt: -1 }).lean(); res.json({ success: true, jobs }); } catch (e) { next(e); } });
router.post("/admin/jobs", async (req, res, next) => {
  try {
    const payload = { ...req.body, createdBy: req.auth.userId, slug: String(req.body.slug || req.body.title || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") };
    if (!payload.applicationDeadline) delete payload.applicationDeadline;
    if (typeof payload.responsibilities === "string") payload.responsibilities = payload.responsibilities.split("\n").map((x) => x.trim()).filter(Boolean);
    if (typeof payload.qualifications === "string") payload.qualifications = payload.qualifications.split("\n").map((x) => x.trim()).filter(Boolean);
    if (typeof payload.skills === "string") payload.skills = payload.skills.split(",").map((x) => x.trim()).filter(Boolean);
    const job = await CareerJob.create(payload); res.status(201).json({ success: true, job });
  } catch (e) { next(e); }
});
router.patch("/admin/jobs/:id", async (req, res, next) => {
  try { if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid vacancy." }); const patch = { ...req.body }; delete patch.createdBy; delete patch._id; delete patch.__v; if (typeof patch.skills === "string") patch.skills = patch.skills.split(",").map((x) => x.trim()).filter(Boolean); if (typeof patch.responsibilities === "string") patch.responsibilities = patch.responsibilities.split("\n").map((x) => x.trim()).filter(Boolean); if (typeof patch.qualifications === "string") patch.qualifications = patch.qualifications.split("\n").map((x) => x.trim()).filter(Boolean); if (patch.applicationDeadline === "") patch.applicationDeadline = null; if (patch.title && !patch.slug) patch.slug = patch.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); const job = await CareerJob.findByIdAndUpdate(req.params.id, patch, { new: true, runValidators: true }); if (!job) return res.status(404).json({ success: false, message: "Vacancy not found." }); res.json({ success: true, job }); } catch (e) { next(e); }
});
router.get("/admin/applications", async (req, res, next) => {
  try { const filter = {}; if (req.query.department) filter.department = String(req.query.department); if (req.query.jobSlug) filter.jobSlug = String(req.query.jobSlug); if (req.query.status) filter.applicationStatus = String(req.query.status); const applications = await CareerApplication.find(filter).select("-resume.data").sort({ createdAt: -1 }).limit(500).lean(); res.json({ success: true, applications }); } catch (e) { next(e); }
});
router.patch("/admin/applications/:id", async (req, res, next) => {
  try { const allowed = ["Applied", "Under Review", "Shortlisted", "Interview Scheduled", "Selected", "Rejected"]; const patch = {}; if (allowed.includes(req.body.applicationStatus)) patch.applicationStatus = req.body.applicationStatus; if (typeof req.body.internalNotes === "string") patch.internalNotes = req.body.internalNotes.slice(0, 5000); const application = await CareerApplication.findByIdAndUpdate(req.params.id, patch, { new: true }).select("-resume.data"); if (!application) return res.status(404).json({ success: false, message: "Application not found." }); res.json({ success: true, application }); } catch (e) { next(e); }
});
router.get("/admin/applications/:id/resume", async (req, res, next) => {
  try { const application = await CareerApplication.findById(req.params.id).select("+resume.data"); if (!application) return res.status(404).json({ success: false, message: "Application not found." }); res.set("Content-Type", application.resume.contentType); res.set("Content-Disposition", `attachment; filename="${application.resume.fileName.replace(/"/g, "")}"`); res.set("Cache-Control", "private, no-store"); return res.send(application.resume.data); } catch (e) { next(e); }
});

module.exports = router;

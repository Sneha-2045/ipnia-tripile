const mongoose = require("mongoose");

const careerApplicationSchema = new mongoose.Schema({
  applicantName: { type: String, required: true, trim: true, maxlength: 160 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  phone: { type: String, required: true, trim: true, maxlength: 30 },
  currentLocation: { type: String, required: true, trim: true, maxlength: 160 },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "CareerJob", default: null },
  jobSlug: { type: String, default: "" },
  position: { type: String, required: true, maxlength: 160 },
  department: { type: String, required: true, maxlength: 120 },
  experience: { type: String, required: true, maxlength: 80 },
  linkedinUrl: { type: String, default: "", maxlength: 500 },
  portfolioUrl: { type: String, default: "", maxlength: 500 },
  coverLetter: { type: String, default: "", maxlength: 5000 },
  resume: { data: { type: Buffer, required: true, select: false }, contentType: { type: String, required: true }, fileName: { type: String, required: true } },
  consentAt: { type: Date, required: true },
  applicationStatus: { type: String, enum: ["Applied", "Under Review", "Shortlisted", "Interview Scheduled", "Selected", "Rejected"], default: "Applied", index: true },
  internalNotes: { type: String, default: "", maxlength: 5000 },
}, { timestamps: true });

careerApplicationSchema.index({ email: 1, jobSlug: 1 });
careerApplicationSchema.index({ department: 1, position: 1, applicationStatus: 1 });
module.exports = mongoose.model("CareerApplication", careerApplicationSchema);

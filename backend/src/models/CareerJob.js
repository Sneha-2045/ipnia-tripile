const mongoose = require("mongoose");

const careerJobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 140 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  department: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  responsibilities: { type: [String], default: [] },
  qualifications: { type: [String], default: [] },
  skills: { type: [String], default: [] },
  experience: { type: String, enum: ["Fresher", "0–2 Years", "2–5 Years", "5–8 Years", "8+ Years"], required: true },
  employmentType: { type: String, enum: ["Full-time", "Part-time", "Internship", "Contract", "Freelance"], required: true },
  workMode: { type: String, enum: ["On-site", "Hybrid", "Remote"], required: true },
  location: { type: String, required: true, trim: true, maxlength: 120 },
  status: { type: String, enum: ["draft", "published", "upcoming", "closed", "archived"], default: "draft", index: true },
  applicationDeadline: { type: Date, default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

careerJobSchema.index({ status: 1, department: 1, createdAt: -1 });
module.exports = mongoose.model("CareerJob", careerJobSchema);

import mongoose from "mongoose";

const jopSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  jobLocation: {
    type: String,
    enum: ["onsite", "remotely", "hybrid"],
    required: true,
  },
  workingTime: {
    type: String,
    enum: ["part-time", "full-time"],
    required: true,
  },
  seniorityLevel: {
    type: String,
    required: true,
    enum: ["Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
  },
  jobDescription: {
    type: String,
    required: true,
  },

  technicalSkills: {
    type: [String],
    required: true,
  },

  softSkills: {
    type: [String],
    required: true,
  },
  addedBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  relatedCompaney:{
    type: mongoose.Types.ObjectId,
    ref: "Companey",
    required: true,
  }
});

export const Jop = mongoose.model("Job", jopSchema);

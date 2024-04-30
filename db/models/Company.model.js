import mongoose from "mongoose";

const componySchema = new mongoose.Schema({
  companyName: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  numberOfEmployees: {
    type: String,
    required: true,
  },
  companyEmail: {
    type: String,
    unique: true,
    required: true,
  },
  companyHR: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Companey = mongoose.model("Companey", componySchema);

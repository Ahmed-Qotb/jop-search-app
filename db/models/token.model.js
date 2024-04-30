import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  isValid: {
    type: Boolean,
    default: true,
  },
});

export const Token = mongoose.model("Token", tokenSchema);

const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  certificateId: {
    type: String,
    unique: true,
    required: true,
  },
});

const Certificate = mongoose.model("Certificate", certificateSchema);
module.exports = Certificate;

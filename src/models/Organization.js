const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: { type: String, trim: true }, // Thêm trường avatar
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: "organization",
  },
  isActive: {
    type: Boolean,
    default: true, // Mặc định là false
  },
  certificatesIssued: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Certificate",
    },
  ],

  courseBundles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseBundle",
    },
  ],
  walletaddress: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model("Organization", OrganizationSchema);

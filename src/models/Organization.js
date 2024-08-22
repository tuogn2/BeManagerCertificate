const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema({
  name: { type: String,
    required: true,
    trim: true,
  },
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
  certificatesIssued: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Certificate",
    },
  ],
  testsCreated: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
    },
  ], // Các bài test mà tổ chức đã tạo
});

module.exports = mongoose.model("Organization", OrganizationSchema);

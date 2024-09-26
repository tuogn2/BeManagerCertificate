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
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course", // Liên kết với mô hình Course
  },
  bundle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CourseBundle',
  },
  score: {
    type: Number,  // Điểm số của bài test
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
  imageUrl: {
    type: String, // Thêm trường imageUrl để lưu liên kết ảnh
    trim: true,
  },
});

const Certificate = mongoose.model("Certificate", certificateSchema);
module.exports = Certificate;

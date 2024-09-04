// Cập nhật mô hình Enrollment để hỗ trợ việc đăng ký bộ khóa học
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  bundle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CourseBundle',
  },
  numborOfCourses: {
    type: Number,
    default: 0,
  },
  idOfItems: {
    type: Array,
    default: [],
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
  progress: {
    type: Number, // Phần trăm hoàn thành khóa học hoặc bộ khóa học
    default: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
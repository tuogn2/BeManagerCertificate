const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  price: {
    type: Number,
    required: true, // 0 nếu miễn phí
  },
  image: {
    type: String,
    trim: true,
  },
  // Các tài liệu trong khóa học
  documents: [
    {
      title: { type: String, required: true }, // Tiêu đề phần học
      content: {
        type: String, // Lưu trữ nội dung tài liệu dưới dạng chuỗi
        trim: true,
        required: true,
      },
    },
  ],
  // Bài kiểm tra cuối khóa
  finalQuiz: {
    title: { type: String, required: true }, // Tiêu đề bài kiểm tra
    duration: { type: Number, required: true }, // Thời gian làm bài kiểm tra
    questions: [
      {
        questionText: { type: String, required: true },
        options: [
          {
            text: { type: String, required: true },
          },
        ],
        correctAnswer: {
          type: String, // Thay đổi kiểu dữ liệu thành String để lưu tên tùy chọn
          required: true,
        },
      },
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  participantsCount: {
    type: Number,
    default: 0, // Khởi tạo mặc định với giá trị là 0
  },
  isActive: {
    type: Boolean,
    default: false, // Mặc định là false
  },
});

module.exports = mongoose.model('Course', courseSchema);

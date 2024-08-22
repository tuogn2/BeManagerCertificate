const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  price: {
    type: Number,
    required: true, // 0 nếu miễn phí
  },
  passingScore: {
    type: Number,
    required: true,
  },
  questions: [
    {
      questionText: {
        type: String,
        required: true,
      },
      options: [
        {
          text: String,
          isCorrect: Boolean, // Đánh dấu đáp án đúng
        },
      ],
    },
  ],
  image: { // Thêm trường ảnh
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  participantsCount: {
    type: Number,
    default: 0, // Khởi tạo mặc định với giá trị là 0
  },
});

const Test = mongoose.model("Test", testSchema);
module.exports = Test;

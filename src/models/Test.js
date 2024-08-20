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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Test = mongoose.model("Test", testSchema);
module.exports = Test;

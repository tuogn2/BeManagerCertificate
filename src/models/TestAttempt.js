const mongoose = require("mongoose");

const testAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true,
  },
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  passed: {
    type: Boolean,
    required: true,
    default: false,
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
      selectedOption: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Option",
        required: true,
      },
      isCorrect: {
        type: Boolean,
        default: false,
      },
    },
  ],
  attemptedAt: {
    type: Date,
    default: Date.now,
  },
});

const TestAttempt = mongoose.model("TestAttempt", testAttemptSchema);
module.exports = TestAttempt;

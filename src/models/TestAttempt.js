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
      questionText: String,
      selectedOption: String,
      isCorrect: Boolean,
    },
  ],
  attemptedAt: {
    type: Date,
    default: Date.now,
  },
});

const TestAttempt = mongoose.model("TestAttempt", testAttemptSchema);
module.exports = TestAttempt;

const mongoose = require('mongoose');

// Define the answer schema
const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  selectedOption: {
    type: String, // Changed from ObjectId to String to match the text-based options
    required: true,
  },
});

// Define the quiz result schema
const quizResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  answers: [answerSchema], // Array of answers for the quiz
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the QuizResult model
const QuizResult = mongoose.model('QuizResult', quizResultSchema);

module.exports = QuizResult;

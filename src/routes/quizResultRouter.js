const express = require('express');
const router = express.Router();
const { submitQuiz, getQuizResult } = require('../controller/quizResultController');

// Route để lưu kết quả bài kiểm tra
router.post('/submit', submitQuiz);

// Route để lấy kết quả bài kiểm tra
// Router definition using URL parameters
router.get('/result/user/:userId/course/:courseId', getQuizResult);


module.exports = router;

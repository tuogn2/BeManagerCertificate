const express = require('express');
const router = express.Router();
const { submitQuiz, getQuizResult } = require('../controller/quizResultController');
const middlewareController = require("../middleware/middlewareController");
/**
 * @swagger
 * tags:
 *   name: QuizResults
 *   description: API endpoints for managing quiz results
 */

/**
 * @swagger
 * /quizzes/submit:
 *   post:
 *     tags: [QuizResults]
 *     summary: Submit a quiz and save the result
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user taking the quiz
 *               courseId:
 *                 type: string
 *                 description: ID of the course for which the quiz is taken
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: string
 *                       description: ID of the question
 *                     answerText:
 *                       type: string
 *                       description: The selected answer
 *     responses:
 *       201:
 *         description: Quiz result saved successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/submit',middlewareController.verifyTokenStudent, submitQuiz);

/**
 * @swagger
 * /quizzes/result/user/{userId}/course/{courseId}:
 *   get:
 *     tags: [QuizResults]
 *     summary: Get the quiz result for a specific user and course
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: ID of the course
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quiz result found
 *       404:
 *         description: Quiz result not found
 *       500:
 *         description: Server error
 */
router.get('/result/user/:userId/course/:courseId', getQuizResult);

module.exports = router;

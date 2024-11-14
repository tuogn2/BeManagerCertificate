

const QuizResult = require('@models/QuizResult');
const Course = require('@models/Course');
const Enrollment = require('@models/Enrollment');

class QuizResultController {
  async submitQuiz(req, res) {
    const { userId, courseId, answers } = req.body;
  
    try {
      // Fetch the course with the final quiz
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      const finalQuiz = course.finalQuiz;
      if (!finalQuiz) {
        return res.status(404).json({ message: "Final quiz not found for this course" });
      }
  
      const totalQuestions = finalQuiz.questions.length;
      if (totalQuestions === 0) {
        return res.status(400).json({ message: "Final quiz has no questions" });
      }
  
      let correctAnswers = 0;
  
      // Calculate the number of correct answers
      finalQuiz.questions.forEach((question) => {
        const userAnswer = answers.find(
          (answer) => answer.questionId.toString() === question._id.toString()
        );
  
        if (userAnswer && userAnswer.answerText === question.correctAnswer) {
          correctAnswers += 1;
        }
      });
  
      // Calculate score as a percentage
      const score = (correctAnswers / totalQuestions) * 100;
  
      // Create a new QuizResult object
      const quizResult = new QuizResult({
        user: userId,
        course: courseId,
        score: score,
        answers: answers.map((answer) => ({
          questionId: answer.questionId,
          selectedOption: answer.answerText, // Ensure answers conform to the schema
        })),
      });
  
      // Save the result to the database
      await quizResult.save();
  
      // If the score is greater than 70, update the enrollment
      if (score >= 70) {
        const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
        if (enrollment) {
          enrollment.completed = true;
          await enrollment.save();
          console.log("Enrollment updated successfully:", enrollment);
        } else {
          console.log("Enrollment not found for user and course");
        }
      }
  
      res.status(201).json({ message: "Quiz result saved successfully", quizResult });
    } catch (error) {
      console.error("Error saving quiz result:", error);
      res.status(500).json({ message: "Error saving quiz result" });
    }
  }
  
  // Lấy kết quả bài kiểm tra
  async getQuizResult(req, res) {
    const { userId, courseId } = req.params;
  
    try {
      const quizResult = await QuizResult.find({
        user: userId,
        course: courseId,
      })
       
  
      if (!quizResult) {
        return res.status(404).json({ message: "Quiz result not found" });
      }
  
      res.json(quizResult);
    } catch (error) {
      console.error("Error fetching quiz result:", error);
      res.status(500).json({ message: "Error fetching quiz result" });
    }
  }
  
}

module.exports = new QuizResultController();

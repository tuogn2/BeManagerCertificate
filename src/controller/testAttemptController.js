const TestAttempt = require("../models/TestAttempt");
const Test = require("../models/Test");
class TestAttemptController {
   
    async create(req, res) {
        const { user, test, answers } = req.body;
        
        try {
          // Tìm bài kiểm tra để lấy thông tin về các câu hỏi và tùy chọn đúng
          const testDetails = await Test.findById(test);
      
          if (!testDetails) {
            return res.status(404).json({ message: "Test không tìm thấy" });
          }
      
          // Tổng số câu hỏi
          const totalQuestions = testDetails.questions.length;
          
          let correctAnswers = 0;
      
          // Duyệt qua các câu hỏi của bài kiểm tra để tính điểm
          const answerArray = testDetails.questions.map(question => {
            const userAnswer = answers[question._id.toString()];
            const correctOption = question.options.find(option => option.isCorrect);
            const isCorrect = userAnswer === correctOption?._id.toString() || false;
      
            if (isCorrect) {
              correctAnswers += 1; // Cộng số câu đúng nếu đáp án đúng
            }
      
            return {
              questionId: question._id,
              selectedOption: userAnswer,
              isCorrect,
            };
          });
      
          // Tính điểm số trên thang 100
          const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
      
          // Tính trạng thái đã vượt (điều kiện tùy chỉnh, ví dụ: vượt nếu đạt điểm tối thiểu)
          const passingScore = 70; // Đặt điểm tối thiểu là 70
          const passed = score >= passingScore;
      
          // Tạo bản ghi TestAttempt mới
          const testAttempt = new TestAttempt({
            user,
            test,
            score,
            passed,
            answers: answerArray,
          });
      
          // Lưu TestAttempt vào cơ sở dữ liệu
          const savedTestAttempt = await testAttempt.save();
      
          // Trả về TestAttempt đã lưu như một phản hồi
          res.status(201).json(savedTestAttempt);
        } catch (error) {
          res.status(400).json({ message: "Lỗi khi tạo thử nghiệm", error });
        }
      }
      
    

    // Đọc thông tin về một test attempt theo ID
    async getById(req, res) {
        try {
            const testAttempt = await TestAttempt.findById(req.params.id)
                .populate("user")
                .populate("test");
            if (!testAttempt) {
                return res.status(404).json({ message: "Test attempt not found" });
            }
            res.status(200).json(testAttempt);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving test attempt", error });
        }
    }

    // Đọc tất cả các test attempt
    async getAll(req, res) {
        try {
            const testAttempts = await TestAttempt.find()
                .populate("user")
                .populate("test");
            res.status(200).json(testAttempts);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving test attempts", error });
        }
    }

    // Chỉnh sửa một test attempt theo ID
    async update(req, res) {
        const { score, passed, answers } = req.body;

        try {
            const updatedTestAttempt = await TestAttempt.findByIdAndUpdate(
                req.params.id,
                { score, passed, answers },
                { new: true }
            );

            if (!updatedTestAttempt) {
                return res.status(404).json({ message: "Test attempt not found" });
            }

            res.status(200).json(updatedTestAttempt);
        } catch (error) {
            res.status(400).json({ message: "Error updating test attempt", error });
        }
    }

    // Xóa một test attempt theo ID
    async delete(req, res) {
        try {
            const deletedTestAttempt = await TestAttempt.findByIdAndDelete(req.params.id);

            if (!deletedTestAttempt) {
                return res.status(404).json({ message: "Test attempt not found" });
            }

            res.status(200).json({ message: "Test attempt deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting test attempt", error });
        }
    }
}

module.exports = new TestAttemptController();

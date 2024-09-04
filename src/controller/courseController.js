const Course = require("../models/Course");

class CourseController {
    async create(req, res) {
        const {
          title,
          description,
          organization,
          price,
          image,
          documents,
          finalQuiz
        } = req.body;
      
        // Validate finalQuiz structure
        if (!finalQuiz || !Array.isArray(finalQuiz.questions)) {
          return res.status(400).json({ message: "Invalid finalQuiz structure" });
        }
      
        // Validate each question
        for (const question of finalQuiz.questions) {
          if (!question.questionText || !Array.isArray(question.options) || !question.correctAnswer) {
            return res.status(400).json({ message: "Each question must have questionText, options, and correctAnswer" });
          }
      
          // Validate options
          for (const option of question.options) {
            if (!option.text) {
              return res.status(400).json({ message: "Each option must have text" });
            }
          }
      
          // Validate correctAnswer as text
          const validOption = question.options.find(option => option.text === question.correctAnswer);
          if (!validOption) {
            return res.status(400).json({ message: "correctAnswer must match one of the options' text" });
          }
        }
      
        try {
          const course = new Course({
            title,
            description,
            organization,
            price,
            image,
            documents,
            finalQuiz
          });
      
          const savedCourse = await course.save();
          res.status(201).json(savedCourse);
        } catch (error) {
          res.status(400).json({ message: "Error creating course", error });
        }
      }
    
    // Đọc thông tin về một khóa học theo ID
    async getById(req, res) {
        try {
            const course = await Course.findById(req.params.id).populate("organization");
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
            res.status(200).json(course);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving course", error });
        }
    }

    // Đọc tất cả các khóa học
    async getAll(req, res) {
        try {
            // Lấy tất cả các trường trừ documents và finalQuiz (nếu muốn bỏ chúng)
            const courses = await Course.find().select('-documents -finalQuiz').populate("organization");
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving courses", error });
        }
    }

    // Chỉnh sửa một khóa học theo ID
    async update(req, res) {
        const { title, description, organization, price, image, documents, finalQuiz } = req.body;

        try {
            const updatedCourse = await Course.findByIdAndUpdate(
                req.params.id,
                { title, description, organization, price, image, documents, finalQuiz },
                { new: true }
            );

            if (!updatedCourse) {
                return res.status(404).json({ message: "Course not found" });
            }

            res.status(200).json(updatedCourse);
        } catch (error) {
            res.status(400).json({ message: "Error updating course", error });
        }
    }

    // Xóa một khóa học theo ID
    async delete(req, res) {
        try {
            const deletedCourse = await Course.findByIdAndDelete(req.params.id);

            if (!deletedCourse) {
                return res.status(404).json({ message: "Course not found" });
            }

            res.status(200).json({ message: "Course deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting course", error });
        }
    }
}

module.exports = new CourseController();

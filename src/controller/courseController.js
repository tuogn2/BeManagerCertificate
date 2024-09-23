const Course = require("../models/Course"); // Đảm bảo đường dẫn đúng đến mô hình Course
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcryptjs");

class CourseController {
  // Tạo khóa học mới
  async create(req, res) {
    const { title, description, organization, price } = req.body;
  
    // Parse finalQuiz back from a string to a JSON object
    let finalQuiz;
    try {
      finalQuiz = JSON.parse(req.body.finalQuiz); // Parse finalQuiz to object
    } catch (error) {
      return res.status(400).json({ message: "Invalid finalQuiz format" });
    }
  
    // Parse documents back from a string to an array of objects
    let documents;
    try {
      documents = JSON.parse(req.body.documents); // Parse documents to array of objects
    } catch (error) {
      return res.status(400).json({ message: "Invalid documents format" });
    }
  
    const image = req.file;
  
    // Validate finalQuiz structure
    if (!finalQuiz || !Array.isArray(finalQuiz.questions)) {
      return res.status(400).json({ message: "Invalid finalQuiz structure" });
    }
  
    // Validate each question in finalQuiz
    for (const question of finalQuiz.questions) {
      if (
        !question.questionText ||
        !Array.isArray(question.options) ||
        !question.correctAnswer
      ) {
        return res.status(400).json({
          message:
            "Each question must have questionText, options, and correctAnswer",
        });
      }
  
      // Validate options
      for (const option of question.options) {
        if (!option.text) {
          return res.status(400).json({ message: "Each option must have text" });
        }
      }
  
      // Validate correctAnswer
      const validOption = question.options.find(
        (option) => option.text === question.correctAnswer
      );
      if (!validOption) {
        return res.status(400).json({
          message: "correctAnswer must match one of the options' text",
        });
      }
    }
  
    try {
      let imageUrl = null;
      if (image) {
        // Upload file to Cloudinary
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: "image" }, (error, result) => {
              if (error) reject(error);
              resolve(result);
            })
            .end(image.buffer);
        });
  
        imageUrl = result.secure_url; // Get image URL
      }
  
      // Create a new course document
      const course = new Course({
        title,
        description,
        organization,
        price,
        image: imageUrl, // Store image URL
        documents, // Use parsed documents array
        finalQuiz, // Use parsed finalQuiz object
      });
  
      // Save course to the database
      const savedCourse = await course.save();
      return res.status(201).json(savedCourse);
    } catch (error) {
      console.error("Error creating course:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
  

  async getCourseByOrganization(req, res) {
    const organizationId = req.params.id;
  
    try {
      // Find all courses by organization ID
      const courses = await Course.find({ organization: organizationId }).populate("organization");
  
      if (!courses || courses.length === 0) {
        return res.status(404).json({ message: "No courses found for this organization" });
      }
  
      return res.status(200).json(courses);
    } catch (error) {
      console.error("Error fetching courses by organization:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
  


  async getAll(req, res) {
    try {
      // Find courses where isActive is true
      const courses = await Course.find({ isActive: true }).populate("organization"); // Adjust if necessary
      return res.status(200).json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
  

  // Lấy khóa học theo ID
  async getById(req, res) {
    const courseId = req.params.id;

    try {
      const course = await Course.findById(courseId).populate("organization"); // Tùy chỉnh nếu cần

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      return res.status(200).json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Cập nhật khóa học theo ID
  async update(req, res) {
    const courseId = req.params.id;
    const { title, description, organization, price, documents, finalQuiz } =
      req.body;

    const image = req.file; // Lấy tệp từ req.file

    try {
      let updateData = {
        title,
        description,
        organization,
        price,
        documents,
        finalQuiz,
      };

      let imageUrl = null;
      if (image) {
        // Tải tệp lên Cloudinary
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: "image" }, (error, result) => {
              if (error) reject(error);
              resolve(result);
            })
            .end(image.buffer);
        });

        imageUrl = result.secure_url; // Lấy URL của ảnh
        updateData.image = imageUrl; // Cập nhật URL của ảnh
      }

      const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        updateData,
        { new: true } // Trả về tài liệu đã cập nhật
      );

      if (!updatedCourse) {
        return res.status(404).json({ message: "Course not found" });
      }

      return res.status(200).json(updatedCourse);
    } catch (error) {
      console.error("Error updating course:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Xóa khóa học theo ID
  async delete(req, res) {
    const courseId = req.params.id;

    try {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      await Course.findByIdAndDelete(courseId);
      return res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      console.error("Error deleting course:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // src/controller/CourseController.js
  async search(req, res) {
    try {
      const query = req.query.query; // Lấy từ khóa tìm kiếm từ query string
      if (!query) {
        return res.status(400).json({ message: "Query parameter is required" });
      }
  
      const courses = await Course.find({
        title: { $regex: query, $options: "i" }, // Tìm kiếm không phân biệt chữ hoa chữ thường
        isActive: true // Chỉ tìm các khóa học có isActive = true
      });
  
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  
  async getInactiveCourses(req, res) {
    try {
      const inactiveCourses = await Course.find({ isActive: false }).populate(
        "organization"
      );
      
      if (!inactiveCourses || inactiveCourses.length === 0) {
        return res.status(404).json({ message: "No inactive courses found" });
      }

      return res.status(200).json(inactiveCourses);
    } catch (error) {
      console.error("Error fetching inactive courses:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }


  async changeActiveToTrue(req, res) {
    const courseId = req.params.id;
  
    try {
      // Find the course by ID and update isActive to true
      const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        { isActive: true },
        { new: true } // Return the updated document
      );
  
      if (!updatedCourse) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      return res.status(200).json({ message: "Course activated successfully", course: updatedCourse });
    } catch (error) {
      console.error("Error activating course:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
  
}

module.exports = new CourseController();

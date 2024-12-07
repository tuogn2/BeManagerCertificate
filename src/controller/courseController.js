

// Sử dụng alias trong require
const Course = require('@models/Course');
const cloudinary = require('cloudinary').v2;
const Enrollment = require('@models/Enrollment');
// const Organization = require('@models/Organization');
const CourseBundle = require('@models/CourseBundle');

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
          return res
            .status(400)
            .json({ message: "Each option must have text" });
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
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 6; // Default to limit of 6 if not provided
    const skip = (page - 1) * limit; // Calculate skip value

    try {
      // Find all courses by organization ID with pagination
      const courses = await Course.find({ organization: organizationId })
        .populate("organization")
        .skip(skip)
        .limit(limit);

      const totalCourses = await Course.countDocuments({
        organization: organizationId,
      }); // Get total number of courses

      if (!courses || courses.length === 0) {
        return res
          .status(404)
          .json({ message: "No courses found for this organization" });
      }

      return res.status(200).json({
        courses,
        totalPages: Math.ceil(totalCourses / limit), // Calculate total pages
        currentPage: page,
      });
    } catch (error) {
      console.error("Error fetching courses by organization:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  async getAll(req, res) {
    try {
      // Get the limit from query parameters, default to 10 if not provided
      const limit = parseInt(req.query.limit) || 6;

      // Find courses where isActive is true and limit the number of items
      const courses = await Course.find({ isActive: true })
        .populate("organization")
        .limit(limit); // Limit the number of courses returned

      return res.status(200).json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  async getAllPagination(req, res) {
    try {
      // Lấy thông tin `page` và `limit` từ query parameters, thiết lập giá trị mặc định nếu không có
      const page = parseInt(req.query.page) || 1; // Trang mặc định là 1
      const limit = parseInt(req.query.limit) || 6; // Giới hạn mặc định là 6
  
      // Tính toán `skip` dựa trên trang hiện tại
      const skip = (page - 1) * limit;
  
      // Tìm các khóa học có `isActive: true`, phân trang và populate "organization"
      const courses = await Course.find({ isActive: true })
        .populate("organization")
        .skip(skip) // Bỏ qua số lượng item tương ứng
        .limit(limit); // Lấy số lượng item giới hạn
  
      // Đếm tổng số khóa học có `isActive: true`
      const totalCourses = await Course.countDocuments({ isActive: true });
  
      // Tính toán tổng số trang
      const totalPages = Math.ceil(totalCourses / limit);
  
      // Trả về dữ liệu với thông tin phân trang
      return res.status(200).json({
        data: courses,
        meta: {
          currentPage: page,
          totalPages,
          totalItems: totalCourses,
        },
      });
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

      // Kiểm tra xem có người dùng nào đã đăng ký khóa học này không
      const enrollments = await Enrollment.find({ course: courseId });
      if (enrollments.length > 0) {
        return res
          .status(400)
          .json({
            message: "Course cannot be deleted as there are students enrolled",
          });
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
      const { query } = req.query; // Lấy từ khóa tìm kiếm
      const limit = 5; // Giới hạn tổng số kết quả trả về

      if (!query) {
        return res.status(400).json({ message: "Query parameter is required" });
      }

      // Tìm kiếm các khóa học dựa trên title, description hoặc tổ chức
      const courses = await Course.find({
        $or: [
          { title: { $regex: query, $options: "i" } }, // Tìm kiếm theo title
          { description: { $regex: query, $options: "i" } }, // Tìm kiếm theo description
        ],
        isActive: true, // Chỉ lấy các khóa học có isActive = true
      });

      // Tìm kiếm các bundle dựa trên title hoặc description
      const bundles = await CourseBundle.find({
        $or: [
          { title: { $regex: query, $options: "i" } }, // Tìm kiếm theo title
          { description: { $regex: query, $options: "i" } }, // Tìm kiếm theo description
        ],
      });
      // Trả về danh sách các khóa học và bundle tìm được
      res.json({ courses: courses, bundles: bundles });
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

      return res
        .status(200)
        .json({
          message: "Course activated successfully",
          course: updatedCourse,
        });
    } catch (error) {
      console.error("Error activating course:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }


  async countCourses(req, res) {
    try {
      const totalCourses = await Course.countDocuments();
      return res.status(200).json({ totalCourses });
    } catch (error) {
      console.error("Error counting courses:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

}

module.exports = new CourseController();

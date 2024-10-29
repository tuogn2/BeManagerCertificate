const Enrollment = require("../models/Enrollment");
const users = require("../models/User");
const Course = require("../models/Course");
const CourseBundle = require("../models/CourseBundle");

class EnrollmentController {
  // Tạo mới một enrollment

  async createBundleEnrollment(req, res) {
    const { user, bundle } = req.body; // Assume bundle ID is passed in the request body
    try {
      // Find the CourseBundle by ID
      const bundleData = await CourseBundle.findById(bundle);

      // Check if the bundle exists
      if (!bundleData) {
        return res.status(404).json({ message: "CourseBundle not found" });
      }

      const existingEnrollment = await Enrollment.findOne({ user, bundle });

      if (existingEnrollment) {
        return res.status(400).json({ message: "User already enrolled in this bundle" });
      }
      // Create a new Enrollment for the bundle
      const enrollment = new Enrollment({
        user,
        bundle, // Assuming you have a field for bundle in your Enrollment model
        numborOfCourses: bundleData.courses.length, // Set the number of courses in the bundle
        completed: true, // Set the completed field to false by default
      });

      // Save the Enrollment to the database
      const savedEnrollment = await enrollment.save();

      // Update the user's enrollments list
      await users.findByIdAndUpdate(
        user, // ID of the user
        { $push: { enrollments: savedEnrollment._id } }, // Push new enrollment ID to enrollments array
        { new: true, useFindAndModify: false } // Return the updated user
      );

      // Return the result
      res.status(201).json(savedEnrollment);
    } catch (error) {
      // Handle any errors that occurred during the process
      console.error("Error creating bundle enrollment:", error); // Log the error for debugging
      res.status(400).json({
        message: "Error creating bundle enrollment",
        error: error.message,
      });
    }
  }

  async create(req, res) {
    const { user, course } = req.body;
    try {
      const courseData = await Course.findById(course);

      if (!courseData) {
        return res.status(404).json({ message: "Course not found" });
      }

      const existingEnrollment = await Enrollment.findOne({ user, course });

      if (existingEnrollment) {
        return res
          .status(400)
          .json({ message: "User already enrolled in this course" });
      }

      const numborOfCourses = courseData.documents.length + 1;
      // Tạo một Enrollment mới
      const enrollment = new Enrollment({
        user,
        course,
        numborOfCourses,
      });

      // Lưu Enrollment vào database
      const savedEnrollment = await enrollment.save();

      // Cập nhật danh sách enrollments của user
      await users.findByIdAndUpdate(
        user, // ID của user
        { $push: { enrollments: savedEnrollment._id } }, // Thêm enrollment mới vào mảng enrollments
        { new: true, useFindAndModify: false } // Trả về user đã được cập nhật
      );

      // Trả về kết quả
      res.status(201).json(savedEnrollment);
    } catch (error) {
      res.status(400).json({ message: "Error creating enrollment", error });
    }
  }

  // Lấy thông tin chi tiết một enrollment theo ID
  async getById(req, res) {
    try {
      const enrollment = await Enrollment.findById(req.params.id)
        .populate("user")
        .populate("course")
        .populate("bundle");
      if (!enrollment) {
        return res.status(404).json({ message: "Enrollment not found" });
      }
      res.status(200).json(enrollment);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving enrollment", error });
    }
  }

  // Lấy tất cả các enrollment
  async getAll(req, res) {
    try {
      const enrollments = await Enrollment.find()
        .populate("user")
        .populate("course")
        .populate("bundle");
      res.status(200).json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving enrollments", error });
    }
  }

  async update(req, res) {
    const { progress, completed, idOfItems } = req.body;

    try {
      // Tìm và cập nhật Enrollment dựa trên ID
      const updatedEnrollment = await Enrollment.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            ...(progress !== undefined && { progress }), // Chỉ cập nhật progress nếu có trong request
            ...(completed !== undefined && { completed }), // Chỉ cập nhật completed nếu có trong request
            ...(idOfItems && { idOfItems }), // Thay thế toàn bộ mảng idOfItems nếu có trong request
          },
        },
        { new: true } // Tùy chọn để trả về bản ghi sau khi cập nhật
      );

      // Nếu không tìm thấy bản ghi, trả về mã lỗi 404
      if (!updatedEnrollment) {
        return res.status(404).json({ message: "Enrollment not found" });
      }

      // Trả về thông tin Enrollment đã cập nhật thành công
      res.status(200).json(updatedEnrollment);
    } catch (error) {
      // Xử lý lỗi và trả về thông báo lỗi cùng mã lỗi 400
      res.status(400).json({ message: "Error updating enrollment", error });
    }
  }

  // Xóa một enrollment theo ID
  async delete(req, res) {
    try {
      const deletedEnrollment = await Enrollment.findByIdAndDelete(
        req.params.id
      );

      if (!deletedEnrollment) {
        return res.status(404).json({ message: "Enrollment not found" });
      }

      res.status(200).json({ message: "Enrollment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting enrollment", error });
    }
  }

  async getEnrollmentsByUser(req, res) {
    const userId = req.params.userId;

    try {
      // Find all enrollments for the user
      const enrollments = await Enrollment.find({ user: userId }).populate(
        "course"
      );

      if (!enrollments || enrollments.length === 0) {
        return res
          .status(404)
          .json({ message: "No enrollments found for this user" });
      }

      return res.status(200).json(enrollments);
    } catch (error) {
      console.error("Error retrieving enrollments:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
  async getEnrollmentsByUserHaveBunbleAndCourse(req, res) {
    const userId = req.params.userId;

    try {
      // Find all enrollments for the user
      const enrollments = await Enrollment.find({ user: userId })
        .populate("course")
        .populate("bundle");

      if (!enrollments || enrollments.length === 0) {
        return res
          .status(404)
          .json({ message: "No enrollments found for this user" });
      }

      return res.status(200).json(enrollments);
    } catch (error) {
      console.error("Error retrieving enrollments:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = new EnrollmentController();

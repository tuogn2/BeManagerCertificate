const Enrollment = require("../models/Enrollment");
const users = require("../models/User");
const Course = require("../models/Course");
class EnrollmentController {
  // Tạo mới một enrollment
  async create(req, res) {
    const { user, course, bundle } = req.body;
    try {
      const courseData = await Course.findById(course);

      if (!courseData) {
        return res.status(404).json({ message: "Course not found" });
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
            ...(idOfItems && { idOfItems }) // Thay thế toàn bộ mảng idOfItems nếu có trong request
          }
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
      const enrollments = await Enrollment.find({ userId: userId });

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

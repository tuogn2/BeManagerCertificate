

// Sử dụng alias trong require
const CourseBundle = require('@models/CourseBundle');
const Enrollment = require('@models/Enrollment');
const cloudinary = require('cloudinary').v2;


class CourseBundleController {
  // Tạo một course bundle mới
  async create(req, res) {
    const { title, description, courses, organization } = req.body;
    const image = req.file; // Giả định bạn đang sử dụng middleware để xử lý file uploads
    console.log(image);
    console.log(req.body);
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

      const courseBundle = new CourseBundle({
        title,
        description,
        courses: JSON.parse(courses),
        organization,
        image: imageUrl, // Lưu URL ảnh
      });

      const savedCourseBundle = await courseBundle.save();
      res.status(201).json(savedCourseBundle);
    } catch (error) {
      res.status(400).json({ message: "Error creating course bundle", error });
    }
  }

  // Lấy tất cả course bundles theo organization
  async getByOrganization(req, res) {
    const { organizationId } = req.params; // Nhận ID tổ chức từ tham số đường dẫn
    try {
      const courseBundles = await CourseBundle.find({
        organization: organizationId,
      })
        .populate("courses")
        .populate("organization");
      res.status(200).json(courseBundles);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving course bundles", error });
    }
  }

  // Đọc thông tin về một course bundle theo ID
  async getById(req, res) {
    try {
      
      const courseBundle = await CourseBundle.findById(req.params.id)
        .populate("courses")
        .populate("organization");
        console.log("tuong");
      if (!courseBundle) {
        return res.status(404).json({ message: "Course bundle not found" });
      }
      res.status(200).json(courseBundle);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving course bundle", error });
    }
  }

  // Đọc tất cả các course bundles
  async getAll(req, res) {
    try {
      // Get the limit from query parameters, default to 6 if not provided
      const limit = parseInt(req.query.limit) || 6;
  
      // Find course bundles and limit the number of items
      const courseBundles = await CourseBundle.find()
        .populate("courses") // Populate the courses field
        .populate("organization") // Populate the organization field
        .limit(limit); // Limit the number of bundles returned
      return res.status(200).json(courseBundles);
    } catch (error) {
      console.error("Error fetching course bundles:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
  

  // Tìm kiếm các course bundles
  async search(req, res) {
    const { query, limit = 2 } = req.query; // Nhận truy vấn tìm kiếm từ tham số URL và giới hạn kết quả
  
    try {
      if (!query) {
        return res.status(400).json({ message: "Query parameter is required" });
      }
  
      // Tìm kiếm course bundles dựa trên title hoặc description
      const courseBundles = await CourseBundle.find({
        $or: [
          { title: { $regex: query, $options: "i" } }, // Tìm kiếm không phân biệt chữ hoa/thường
          { description: { $regex: query, $options: "i" } },
        ],
      })
        .populate("courses")
        .populate("organization")
        .limit(parseInt(limit)); // Giới hạn số lượng kết quả trả về
  
      res.status(200).json(courseBundles);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving course bundles", error });
    }
  }
  

  // Chỉnh sửa một course bundle theo ID
  async update(req, res) {
    const { title, description, courses, organization } = req.body;
    const image = req.file; // Nhận ảnh từ request
    try {
      let imageUrl = null;

      // Nếu có ảnh mới, tải lên Cloudinary
      if (image) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: "image" }, (error, result) => {
              if (error) reject(error);
              resolve(result);
            })
            .end(image.buffer);
        });
        imageUrl = result.secure_url; // Lưu URL ảnh
      }

      // Cập nhật course bundle
      const updatedCourseBundle = await CourseBundle.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          courses: JSON.parse(courses),
          organization,
          ...(imageUrl && { image: imageUrl }), // Chỉ cập nhật ảnh nếu có
        },
        { new: true }
      );

      if (!updatedCourseBundle) {
        return res.status(404).json({ message: "Course bundle not found" });
      }

      res.status(200).json(updatedCourseBundle);
    } catch (error) {
      res.status(400).json({ message: "Error updating course bundle", error });
    }
  }

  // Xóa một course bundle theo ID
  async delete(req, res) {
    try {
      const enrollments = await Enrollment.find({ bundle: req.params.id });

      if (enrollments.length > 0) {
        return res.status(400).json({
          message: "Cannot delete course bundle; users are enrolled.",
        });
      }

      const deletedCourseBundle = await CourseBundle.findByIdAndDelete(
        req.params.id
      );

      if (!deletedCourseBundle) {
        return res.status(404).json({ message: "Course bundle not found" });
      }

      res.status(200).json({ message: "Course bundle deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting course bundle", error });
    }
  }


  async countCoursesBunble(req, res) {
    try {
      const count = await CourseBundle.countDocuments();
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ message: "Error counting course bundles", error });
    }
  }
}

module.exports = new CourseBundleController();

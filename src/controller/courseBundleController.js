const CourseBundle = require("../models/CourseBundle");

class CourseBundleController {
    // Tạo một course bundle mới
    async create(req, res) {
        const { title, description, courses, organization } = req.body;
        try {
            const courseBundle = new CourseBundle({
                title,
                description,
                courses,
                organization,
            });

            const savedCourseBundle = await courseBundle.save();
            res.status(201).json(savedCourseBundle);
        } catch (error) {
            res.status(400).json({ message: "Error creating course bundle", error });
        }
    }

    // Đọc thông tin về một course bundle theo ID
    async getById(req, res) {
        try {
            const courseBundle = await CourseBundle.findById(req.params.id)
                .populate("courses")
                .populate("organization");
            if (!courseBundle) {
                return res.status(404).json({ message: "Course bundle not found" });
            }
            res.status(200).json(courseBundle);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving course bundle", error });
        }
    }

    // Đọc tất cả các course bundles
    async getAll(req, res) {
        try {
            const courseBundles = await CourseBundle.find()
                .populate("courses")
                .populate("organization");
            res.status(200).json(courseBundles);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving course bundles", error });
        }
    }

    // Chỉnh sửa một course bundle theo ID
    async update(req, res) {
        const { title, description, courses, organization } = req.body;

        try {
            const updatedCourseBundle = await CourseBundle.findByIdAndUpdate(
                req.params.id,
                { title, description, courses, organization },
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
            const deletedCourseBundle = await CourseBundle.findByIdAndDelete(req.params.id);

            if (!deletedCourseBundle) {
                return res.status(404).json({ message: "Course bundle not found" });
            }

            res.status(200).json({ message: "Course bundle deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting course bundle", error });
        }
    }
}

module.exports = new CourseBundleController();

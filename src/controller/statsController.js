// Import các model
const User = require("../models/User");
const Organization = require("../models/Organization");
const Certificate = require("../models/Certificate");
const QuizResult = require("../models/quizResult");
const Course = require("../models/Course");
const CourseBundle = require("../models/CourseBundle");
const Enrollment = require("../models/Enrollment");

const mongoose = require("mongoose");
class StatsController {
  // Định nghĩa hàm getModelByType đúng cách
  getModelByType(type) {
    switch (type) {
      case "users":
        return User;
      case "organizations":
        return Organization;
      case "certificates":
        return Certificate;
      case "courses":
        return Course;
      case "bundles":
        return CourseBundle;
      case "enrollments":
        return Enrollment;
      default:
        return null;
    }
  }

  // API lấy dữ liệu biểu đồ cột theo tháng/năm
  async getBarChartData(req, res) {
    const { year = new Date().getFullYear(), type } = req.query;

    try {
      let Model;
      switch (type) {
        case "users":
          Model = User;
          break;
        case "organizations":
          Model = Organization;
          break;
        case "certificates":
          Model = Certificate;
          break;
        case "courses":
          Model = Course;
          break;
        case "bundles":
          Model = CourseBundle;
          break;
        case "enrollments":
          Model = Enrollment;
          break;
        default:
          return res.status(400).json({ error: `Invalid type: ${type}` });
      }

      if (!Model) {
        return res.status(400).json({ error: `Invalid type: ${type}` });
      }

      // Xác định tên trường ngày phù hợp dựa vào loại đối tượng
      const dateField =
        type === "enrollments"
          ? "enrolledAt"
          : type === "certificates"
          ? "issueDate"
          : "createdAt";

      const data = await Model.aggregate([
        {
          $match: {
            [dateField]: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`),
            },
          },
        },
        {
          $group: {
            _id: { $month: `$${dateField}` }, // Sử dụng `$${dateField}` để tham chiếu động đến trường
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      res.status(200).json({ year, data });
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
      res.status(500).json({
        error: "Failed to fetch bar chart data",
        details: error.message,
      });
    }
  }

  async getTopEnrollments(req, res) {
    const { month, year } = req.query;
    
    // Tính toán tháng và năm tiếp theo
    const nextYear = month === '12' ? (parseInt(year) + 1).toString() : year;
    const nextMonth = month === '12' ? '01' : (parseInt(month) + 1).toString().padStart(2, '0');

    try {
        const topEnrollments = await Enrollment.aggregate([
            {
                $match: {
                    enrolledAt: {
                        $gte: new Date(`${year}-${month}-01`),
                        $lt: new Date(`${nextYear}-${nextMonth}-01`), // Tháng tiếp theo
                    },
                },
            },
            {
                $match: {
                    course: { $ne: null }, // Chỉ lấy enrollments có khóa học
                },
            },
            {
                $group: {
                    _id: "$course", // Nhóm theo course ID
                    count: { $sum: 1 }, // Đếm số lượng enrollments
                },
            },
            {
                $lookup: {
                    from: "courses", // Tên collection của khóa học
                    localField: "_id",
                    foreignField: "_id",
                    as: "courseDetails",
                },
            },
            {
                $unwind: {
                    path: "$courseDetails",
                    preserveNullAndEmptyArrays: true // Giữ lại các kết quả không có chi tiết khóa học
                },
            },
            {
                $sort: { count: -1 }, // Sắp xếp theo số lượng enrollment giảm dần
            },
            {
                $limit: 5, // Chỉ lấy top 5
            },
            {
                $project: {
                    _id: 0,
                    enrollmentType: "course", // Xác định loại là course
                    id: "$courseDetails._id", // Lấy ID khóa học
                    title: "$courseDetails.title", // Lấy tên khóa học
                    count: 1, // Số lượng enrollments
                },
            },
        ]);
        
        res.status(200).json({ topEnrollments });
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch top enrollments",
            details: error.message,
        });
    }
}


async getTopBundleEnrollments(req, res) {
  const { month, year } = req.query;

  // Tính toán tháng và năm tiếp theo
  const nextYear = month === '12' ? (parseInt(year) + 1).toString() : year;
  const nextMonth = month === '12' ? '01' : (parseInt(month) + 1).toString().padStart(2, '0');

  try {
      const topEnrollments = await Enrollment.aggregate([
          {
              $match: {
                  enrolledAt: {
                      $gte: new Date(`${year}-${month}-01`),
                      $lt: new Date(`${nextYear}-${nextMonth}-01`), // Tháng tiếp theo
                  },
                  bundle: { $ne: null }, // Chỉ lấy enrollments có bundle
              },
          },
          {
              $group: {
                  _id: "$bundle", // Nhóm theo bundle ID
                  count: { $sum: 1 }, // Đếm số lượng enrollments
              },
          },
          {
              $lookup: {
                  from: "coursebundles", // Tên collection của bundle
                  localField: "_id",
                  foreignField: "_id",
                  as: "bundleDetails",
              },
          },
          {
              $unwind: {
                  path: "$bundleDetails",
                  preserveNullAndEmptyArrays: true // Giữ lại các kết quả không có chi tiết bundle
              },
          },
          {
              $sort: { count: -1 }, // Sắp xếp theo số lượng enrollment giảm dần
          },
          {
              $limit: 5, // Chỉ lấy top 5
          },
          {
              $project: {
                  _id: 0,
                  enrollmentType: "bundle", // Xác định loại là bundle
                  id: "$bundleDetails._id", // Lấy ID bundle
                  title: "$bundleDetails.title", // Lấy tên bundle
                  count: 1, // Số lượng enrollments
              },
          },
      ]);

      // Kiểm tra nếu không tìm thấy enrollments nào
      

      res.status(200).json({ topEnrollments });
  } catch (error) {
      res.status(500).json({
          error: "Failed to fetch top bundle enrollments",
          details: error.message,
      });
  }
}



async getTopCertificates(req, res) {
  const { month, year } = req.query;

  // Tính toán tháng và năm tiếp theo
  const nextYear = month === '12' ? (parseInt(year) + 1).toString() : year;
  const nextMonth = month === '12' ? '01' : (parseInt(month) + 1).toString().padStart(2, '0');

  try {
      const topCertificates = await Certificate.aggregate([
          {
              $match: {
                  issueDate: {
                      $gte: new Date(`${year}-${month}-01`),
                      $lt: new Date(`${nextYear}-${nextMonth}-01`), // Tháng tiếp theo
                  },
              },
          },
          {
              $lookup: {
                  from: "courses", // Tên collection của khóa học
                  localField: "course",
                  foreignField: "_id",
                  as: "courseDetails",
              },
          },
          {
              $unwind: {
                  path: "$courseDetails",
                  preserveNullAndEmptyArrays: true // Giữ lại các kết quả không có chi tiết khóa học
              },
          },
          {
              $group: {
                  _id: "$course", // Nhóm theo course ID
                  count: { $sum: 1 }, // Đếm số lượng chứng chỉ cho mỗi khóa học
                  title: { $first: "$courseDetails.title" }, // Lấy tên khóa học
              },
          },
          {
              $sort: { count: -1 }, // Sắp xếp theo số lượng chứng chỉ giảm dần
          },
          {
              $limit: 5, // Chỉ lấy top 5
          },
          {
              $project: {
                  _id: 0,
                  courseId: "$_id", // Lấy ID khóa học
                  title: 1, // Lấy tên khóa học
                  count: 1, // Số lượng chứng chỉ
              },
          },
      ]);

      res.status(200).json({ topCertificates });
  } catch (error) {
      res.status(500).json({
          error: "Failed to fetch top certificates by course",
          details: error.message,
      });
  }
}

async getTopCertificatesByBundle(req, res) {
  const { month, year } = req.query;

  // Tính toán tháng và năm tiếp theo
  const nextYear = month === '12' ? (parseInt(year) + 1).toString() : year;
  const nextMonth = month === '12' ? '01' : (parseInt(month) + 1).toString().padStart(2, '0');

  try {
      const topCertificates = await Certificate.aggregate([
          {
              $match: {
                  issueDate: {
                      $gte: new Date(`${year}-${month}-01`),
                      $lt: new Date(`${nextYear}-${nextMonth}-01`), // Tháng tiếp theo
                  },
              },
          },
          {
              $match: {
                  bundle: { $ne: null }, // Chỉ lấy chứng chỉ có bundle
              },
          },
          {
              $lookup: {
                  from: "coursebundles", // Tên collection của bundle
                  localField: "bundle",
                  foreignField: "_id",
                  as: "bundleDetails",
              },
          },
          {
              $unwind: {
                  path: "$bundleDetails",
                  preserveNullAndEmptyArrays: true // Giữ lại các kết quả không có chi tiết bundle
              },
          },
          {
              $group: {
                  _id: "$bundle", // Nhóm theo bundle ID
                  count: { $sum: 1 }, // Đếm số lượng chứng chỉ cho mỗi bundle
                  title: { $first: "$bundleDetails.title" }, // Lấy tên bundle
              },
          },
          {
              $sort: { count: -1 }, // Sắp xếp theo số lượng chứng chỉ giảm dần
          },
          {
              $limit: 5, // Chỉ lấy top 5
          },
          {
              $project: {
                  _id: 0,
                  bundleId: "$_id", // Lấy ID bundle
                  title: 1, // Lấy tên bundle
                  count: 1, // Số lượng chứng chỉ
              },
          },
      ]);

      res.status(200).json({ topCertificates });
  } catch (error) {
      res.status(500).json({
          error: "Failed to fetch top certificates by bundle",
          details: error.message,
      });
  }
}
 

async getUserStats(req, res) {
  const { id:userId } = req.params;

  // Chuyển đổi userId thành ObjectId nếu cần thiết
  const objectIdUserId = new mongoose.Types.ObjectId(userId);

  try {
    // Tổng số khóa học mà người dùng đã đăng ký (enrolled courses)
    const totalEnrollments = await Enrollment.countDocuments({ user: objectIdUserId });

    // Tổng số chứng chỉ của người dùng
    const totalCertificates = await Certificate.countDocuments({ user: objectIdUserId });

    // Tổng số chứng chỉ theo bundle
    const totalBundleCertificates = await Certificate.countDocuments({
      user: objectIdUserId,
      bundle: { $ne: null },
    });

    // Tính điểm trung bình của người dùng từ các chứng chỉ
    const avgScoreData = await Certificate.aggregate([
      {
        $match: {
          user: objectIdUserId, // Sử dụng objectIdUserId
          score: { $exists: true, $ne: null }, // Đảm bảo score tồn tại
        },
      },
      {
        $group: {
          _id: null,
          avgScore: { $avg: "$score" }, // Tính trung bình điểm số
        },
      },
    ]);

    const avgScore = avgScoreData.length > 0 ? avgScoreData[0].avgScore : 0;

    // Trả về dữ liệu thống kê
    res.status(200).json({
      totalEnrollments,
      totalCertificates,
      totalBundleCertificates,
      avgScore,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({
      error: "Failed to fetch user stats",
      details: error.message,
    });
  }
}





}

module.exports = new StatsController();

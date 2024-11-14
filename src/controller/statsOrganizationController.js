
// Thêm dòng này
const mongoose = require('mongoose'); // Đảm bảo kết nối MongoDB

// Sử dụng alias thay vì đường dẫn tương đối
const User = require('@models/User');
const Organization = require('@models/Organization');
const Certificate = require('@models/Certificate');
const QuizResult = require('@models/QuizResult');
const Course = require('@models/Course');
const CourseBundle = require('@models/CourseBundle');
const Enrollment = require('@models/Enrollment');

class statsOrganizationController {
  // Định nghĩa hàm getModelByType đúng cách
  

  


  
  async getTopEnrollmentsCourse(req, res) {
    const { month, year, organizationId } = req.query;

    const nextYear = month === '12' ? (parseInt(year) + 1).toString() : year;
    const nextMonth = month === '12' ? '01' : (parseInt(month) + 1).toString().padStart(2, '0');

    console.log(`Tháng: ${month}, Năm: ${year}, ID Tổ chức: ${organizationId}`);

    try {
      const matchQuery = {
        enrolledAt: {
          $gte: new Date(`${year}-${month}-01`),
          $lt: new Date(`${nextYear}-${nextMonth}-01`),
        },
      };

      console.log("Truy vấn Khớp:", matchQuery);

      const topEnrollments = await Enrollment.aggregate([
        {
          $match: matchQuery, // Lọc enrollment theo thời gian
        },
        {
          $lookup: {
            from: 'courses', // Tên bộ sưu tập khóa học
            localField: 'course', // Trường khóa học trong enrollment
            foreignField: '_id', // Trường ID trong khóa học
            as: 'courseDetails',
          },
        },
        {
          $unwind: {
            path: '$courseDetails', // Giải nén mảng khóa học
            preserveNullAndEmptyArrays: true, // Giữ lại enrollment nếu không có khóa học
          },
        },
        {
          $match: {
            'courseDetails.organization': new mongoose.Types.ObjectId(organizationId), // Lọc theo ID tổ chức
          },
        },
        {
          $group: {
            _id: '$course', // Nhóm theo ID khóa học
            count: { $sum: 1 }, // Đếm số lượng enrollments
            title: { $first: '$courseDetails.title' }, // Lấy tên khóa học
          },
        },
        {
          $sort: { count: -1 }, // Sắp xếp theo số lượng enrollments giảm dần
        },
        {
          $limit: 5, // Giới hạn kết quả cho 5 khóa học hàng đầu
        },
        {
          $project: {
            _id: 0, // Không bao gồm trường _id trong kết quả
            courseId: '$_id', // Đưa ID khóa học vào kết quả
            title: 1, // Bao gồm tên khóa học
            count: 1, // Bao gồm số lượng enrollments
          },
        },
      ]);

      console.log("Top Enrollments:", topEnrollments);
      res.status(200).json({ topEnrollments });
    } catch (error) {
      console.error('Lỗi khi lấy top enrollments cho khóa học:', error);
      res.status(500).json({
        error: 'Không thể lấy top enrollments cho khóa học',
        details: error.message,
      });
    }
  }
  

  async getTopEnrollmentsBundle(req, res) {
    const { month, year, organizationId } = req.query;
  
    const nextYear = month === '12' ? (parseInt(year) + 1).toString() : year;
    const nextMonth = month === '12' ? '01' : (parseInt(month) + 1).toString().padStart(2, '0');
  
    console.log(`Tháng: ${month}, Năm: ${year}, ID Tổ chức: ${organizationId}`);
  
    try {
      const matchQuery = {
        enrolledAt: {
          $gte: new Date(`${year}-${month}-01`),
          $lt: new Date(`${nextYear}-${nextMonth}-01`),
        },
      };
  
      console.log("Truy vấn Khớp:", matchQuery);
  
      const topEnrollments = await Enrollment.aggregate([
        {
          $match: matchQuery, // Lọc enrollment theo thời gian
        },
        {
          $lookup: {
            from: 'coursebundles', // Tên bộ sưu tập course bundles
            localField: 'bundle', // Trường bundle trong enrollment
            foreignField: '_id', // Trường ID trong course bundle
            as: 'bundleDetails',
          },
        },
        {
          $unwind: {
            path: '$bundleDetails', // Giải nén mảng bundle
            preserveNullAndEmptyArrays: true, // Giữ lại enrollment nếu không có bundle
          },
        },
        {
          $match: {
            'bundleDetails.organization': new mongoose.Types.ObjectId(organizationId), // Lọc theo ID tổ chức
          },
        },
        {
          $group: {
            _id: '$bundle', // Nhóm theo ID bundle
            count: { $sum: 1 }, // Đếm số lượng enrollments
            title: { $first: '$bundleDetails.title' }, // Lấy tên bundle
          },
        },
        {
          $sort: { count: -1 }, // Sắp xếp theo số lượng enrollments giảm dần
        },
        {
          $limit: 5, // Giới hạn kết quả cho 5 bundle hàng đầu
        },
        {
          $project: {
            _id: 0, // Không bao gồm trường _id trong kết quả
            bundleId: '$_id', // Đưa ID bundle vào kết quả
            title: 1, // Bao gồm tên bundle
            count: 1, // Bao gồm số lượng enrollments
          },
        },
      ]);
  
      console.log("Top Enrollments Bundle:", topEnrollments);
      res.status(200).json({ topEnrollments });
    } catch (error) {
      console.error('Lỗi khi lấy top enrollments cho bundle:', error);
      res.status(500).json({
        error: 'Không thể lấy top enrollments cho bundle',
        details: error.message,
      });
    }
  }
  
}

module.exports = new statsOrganizationController();

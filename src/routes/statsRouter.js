const express = require('express');
const route = express.Router();
const statsController = require('@controllers/statsController'); // Sử dụng alias @controllers


// Biểu đồ cột
route.get('/bar-chart', statsController.getBarChartData);

// Top 5 khóa học/bundle có lượt Enrollment nhiều nhất
route.get('/top-enrollments-course', statsController.getTopEnrollments);
route.get('/top-enrollments-bundle', statsController.getTopBundleEnrollments);

// Top 5 khóa học có lượt hoàn thành nhiều nhất
route.get('/top-certificates-course', statsController.getTopCertificates);
route.get('/top-certificates-bundle', statsController.getTopCertificatesByBundle);

route.get('/user-stats/:id', statsController.getUserStats);
module.exports = route;

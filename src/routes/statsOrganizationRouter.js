const express = require('express');
const route = express.Router();
const statsOrganizationController = require('@controllers/statsOrganizationController'); // Sử dụng alias @controllers


// Biểu đồ cột

// Top 5 khóa học/bundle có lượt Enrollment nhiều nhất
route.get('/top-enrollments-course', statsOrganizationController.getTopEnrollmentsCourse);
route.get('/top-enrollments-bundle', statsOrganizationController.getTopEnrollmentsBundle);

// // Top 5 khóa học có lượt hoàn thành nhiều nhất
// route.get('/top-certificates-course', statsOrganizationController.getTopCertificates);
// route.get('/top-certificates-bundle', statsOrganizationController.getTopCertificatesByBundle);

module.exports = route;

const express = require('express');
const router = express.Router();
const enrollmentController = require('../controller/EnrollmentController');

// Tạo mới enrollment
router.post('/', enrollmentController.create);

// Lấy tất cả enrollments
router.get('/', enrollmentController.getAll);

// Lấy chi tiết một enrollment theo ID
router.get('/:id', enrollmentController.getById);

// Cập nhật enrollment theo ID
router.put('/:id', enrollmentController.update);

// Xóa enrollment theo ID
router.delete('/:id', enrollmentController.delete);

// Get all enrollments for a specific user
router.get('/user/:userId', enrollmentController.getEnrollmentsByUser);

module.exports = router;

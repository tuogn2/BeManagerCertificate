const express = require('express');
const router = express.Router();
const courseController = require('../controller/CourseController');

// Tạo mới khóa học
router.post('/', courseController.create);

// Lấy tất cả khóa học
router.get('/', courseController.getAll);

// Lấy chi tiết một khóa học theo ID
router.get('/:id', courseController.getById);

// Cập nhật khóa học theo ID
router.put('/:id', courseController.update);

// Xóa khóa học theo ID
router.delete('/:id', courseController.delete);

module.exports = router;

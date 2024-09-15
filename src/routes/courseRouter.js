const express = require('express');
const router = express.Router();
const courseController = require('../controller/CourseController'); // Đảm bảo đường dẫn đúng
const upload = require('../middleware/upload'); // Import middleware upload

// Tạo mới khóa học (với hình ảnh)
router.post('/', upload.single('image'), courseController.create);
router.get('/search', courseController.search);

// Lấy tất cả khóa học
router.get('/', courseController.getAll);

// Lấy chi tiết một khóa học theo ID
router.get('/:id', courseController.getById);

// Cập nhật khóa học theo ID (với hình ảnh)
router.put('/:id', upload.single('image'), courseController.update);

// Xóa khóa học theo ID
router.delete('/:id', courseController.delete);


module.exports = router;

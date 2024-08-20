const express = require('express');
const router = express.Router();
const testController = require('../controller/testController');

// Route để tạo một bài test mới
router.post('/', testController.create);

// Route để lấy thông tin về một bài test theo ID
router.get('/:id', testController.getById);

// Route để lấy tất cả các bài test
router.get('/', testController.getAll);

// Route để cập nhật một bài test theo ID
router.put('/:id', testController.update);

module.exports = router;

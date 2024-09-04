const express = require('express');
const router = express.Router();
const courseBundleController = require('../controller/CourseBundleController');

// Tạo mới course bundle
router.post('/', courseBundleController.create);

// Lấy tất cả course bundles
router.get('/', courseBundleController.getAll);

// Lấy chi tiết một course bundle theo ID
router.get('/:id', courseBundleController.getById);

// Cập nhật course bundle theo ID
router.put('/:id', courseBundleController.update);

// Xóa course bundle theo ID
router.delete('/:id', courseBundleController.delete);

module.exports = router;

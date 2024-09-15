const express = require('express');
const router = express.Router();
const organizationController = require('../controller/organizationController');
const upload = require('../middleware/upload'); // Import middleware upload

// Route tạo tổ chức mới với ảnh
router.post('/', upload.single('avatar'), organizationController.createOrganization);

// Route lấy tất cả tổ chức
router.get('/', organizationController.getAllOrganizations);

// Route lấy tổ chức theo ID
router.get('/:id', organizationController.getOrganizationById); 

// Route cập nhật tổ chức theo ID với ảnh
router.put('/:id', upload.single('avatar'), organizationController.updateOrganization);

// Route xóa tổ chức theo ID
router.delete('/:id', organizationController.deleteOrganization);

module.exports = router;

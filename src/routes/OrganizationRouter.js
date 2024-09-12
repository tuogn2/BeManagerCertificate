const express = require('express');
const router = express.Router();
const organizationController = require('../controller/organizationController');

// Route tạo tổ chức mới
router.post('/', organizationController.createOrganization);

// Route lấy tất cả tổ chức
router.get('/', organizationController.getAllOrganizations);

// Route lấy tổ chức theo ID
router.get('/:id', organizationController.getOrganizationById); 

// Route cập nhật tổ chức theo ID
router.put('/:id', organizationController.updateOrganization);

// Route xóa tổ chức theo ID
router.delete('/:id', organizationController.deleteOrganization);

module.exports = router;

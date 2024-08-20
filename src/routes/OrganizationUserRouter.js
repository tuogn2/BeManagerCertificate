const express = require('express');
const router = express.Router();
const OrganizationUserController = require('../controller/organizationUserController');
// Route để tạo người dùng mới
router.post('/', OrganizationUserController.createOrganizationUser);

// Route để lấy tất cả người dùng
router.get('/', OrganizationUserController.getAllOrganizationUsers);

// Route để lấy người dùng theo ID
router.get('/:id', OrganizationUserController.getOrganizationUserById);

// Route để cập nhật người dùng theo ID
router.put('/:id', OrganizationUserController.updateOrganizationUser);

// Route để xóa người dùng theo ID
router.delete('/:id', OrganizationUserController.deleteOrganizationUser);

module.exports = router;

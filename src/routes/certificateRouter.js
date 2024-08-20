const express = require("express");
const router = express.Router();
const certificateController = require("../controller/certificateController");

// Route để tạo một certificate mới
router.post("/", certificateController.create);

// Route để lấy thông tin về một certificate theo ID
router.get("/:id", certificateController.getById);

// Route để lấy tất cả các certificates
router.get("/", certificateController.getAll);

// Route để cập nhật một certificate theo ID
router.put("/:id", certificateController.update);

// Route để xóa một certificate theo ID
router.delete("/:id", certificateController.delete);

module.exports = router;

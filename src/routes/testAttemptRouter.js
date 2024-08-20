const express = require("express");
const router = express.Router();
const testAttemptController = require("../controller/testAttemptController");

// Route để tạo một test attempt mới
router.post("/", testAttemptController.create);

// Route để lấy thông tin về một test attempt theo ID
router.get("/:id", testAttemptController.getById);

// Route để lấy tất cả các test attempt
router.get("/", testAttemptController.getAll);

// Route để cập nhật một test attempt theo ID
router.put("/:id", testAttemptController.update);

// Route để xóa một test attempt theo ID
router.delete("/:id", testAttemptController.delete);

module.exports = router;

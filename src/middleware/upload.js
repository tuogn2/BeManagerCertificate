const multer = require('multer');
const storage = multer.memoryStorage(); // Sử dụng bộ nhớ tạm để lưu trữ tệp
const upload = multer({ storage: storage });

module.exports = upload;

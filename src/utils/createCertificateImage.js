const { createCanvas, loadImage } = require('canvas');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

// Hàm tạo hình ảnh chứng chỉ
async function createCertificateImage(certificateData) {
  // Đặt kích thước của ảnh chứng chỉ
  const width = 850;
  const height = 600;
  
  // Tạo một canvas mới với kích thước đã định
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Vẽ nền cho chứng chỉ
  ctx.fillStyle = '#f7f7f7';
  ctx.fillRect(0, 0, width, height); // Vẽ hình chữ nhật để làm nền
  
  // Vẽ khung cho chứng chỉ
  ctx.strokeStyle = '#4CAF50';  // Màu khung
  ctx.lineWidth = 10;  // Độ dày khung
  ctx.strokeRect(10, 10, width - 20, height - 20); // Vẽ khung ngoài
  
  // Thêm tiêu đề "Certificate of Completion"
  ctx.fillStyle = '#2c3e50';
  ctx.font = '48px "Times New Roman", serif'; // Font chữ có hỗ trợ tiếng Việt
  ctx.textAlign = 'center';
  ctx.fillText('Certificate of Completion', width / 2, 100);
  
  // Thêm tên người nhận (hỗ trợ tiếng Việt)
  ctx.fillStyle = '#34495e';
  ctx.font = '36px "Arial", sans-serif'; // Font chữ hỗ trợ tiếng Việt
  ctx.fillText(certificateData.userName, width / 2, 200);
  
  // Thêm tên khóa học
  ctx.font = '28px "Georgia", serif'; // Font chữ hỗ trợ tiếng Việt
  ctx.fillText('For successfully completing the course', width / 2, 250);
  ctx.fillText(certificateData.courseName, width / 2, 300);
  
  // Thêm điểm số
  ctx.fillStyle = '#16a085';
  ctx.font = '24px "Georgia", serif'; // Font chữ hỗ trợ tiếng Việt
  ctx.fillText(`Score: ${certificateData.score}`, width / 2, 350);
  
  // Kiểm tra nếu có logo tổ chức và tải logo
  try {
    const logo = await loadImage(certificateData.organizationAvt);  // Tải logo tổ chức từ URL hoặc đường dẫn
    ctx.drawImage(logo, (width / 2) - 50, 400, 100, 100);  // Vẽ logo vào canvas
  } catch (error) {
    console.log("Logo error: ", error);  // Nếu có lỗi khi tải logo, bỏ qua phần logo
  }
  
  // Thêm thông tin tổ chức
  ctx.fillStyle = '#333';
  ctx.font = '24px "Arial", sans-serif'; // Font chữ hỗ trợ tiếng Việt
  ctx.fillText(certificateData.organizationName, width / 2, 530);
  ctx.fillText(`Issued on: ${new Date().toLocaleDateString()}`, width / 2, 560);
  
  // Thêm thông tin bản quyền
  ctx.fillStyle = '#777';
  ctx.font = '18px "Arial", sans-serif'; // Font chữ hỗ trợ tiếng Việt
  ctx.fillText(`All rights reserved © ${certificateData.organizationName}`, width / 2, 580);

  // Lưu hình ảnh vào file tạm
  const imagePath = path.join(__dirname, 'certificate.png');
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(imagePath, buffer);  // Lưu file ảnh

  // Tải ảnh lên Cloudinary
  const result = await cloudinary.uploader.upload(imagePath);

  // Xóa file ảnh tạm thời sau khi tải lên
  fs.unlinkSync(imagePath);

  // Trả về URL của ảnh trên Cloudinary
  return result.secure_url;
}

module.exports = createCertificateImage;

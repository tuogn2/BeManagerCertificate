const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

async function createCertificateImage(certificateData) {
  const width = 850;
  const height = 600;

  // Tạo nền cho chứng chỉ
  const background = Buffer.from(`
    <svg width="${width}" height="${height}">
      <rect width="${width}" height="${height}" fill="#f7f7f7" />
      <rect x="10" y="10" width="${width - 20}" height="${height - 20}" fill="none" stroke="#4CAF50" stroke-width="10" />
      <text x="${width / 2}" y="100" font-size="48" text-anchor="middle" font-family="'Times New Roman', serif" fill="#2c3e50">Certificate of Completion</text>
      <text x="${width / 2}" y="200" font-size="36" text-anchor="middle" font-family="'Arial', sans-serif" fill="#34495e">${certificateData.userName}</text>
      <text x="${width / 2}" y="250" font-size="28" text-anchor="middle" font-family="'Georgia', serif" fill="#34495e">For successfully completing the course</text>
      <text x="${width / 2}" y="300" font-size="28" text-anchor="middle" font-family="'Georgia', serif" fill="#34495e">${certificateData.courseName}</text>
      <text x="${width / 2}" y="350" font-size="24" text-anchor="middle" font-family="'Georgia', serif" fill="#16a085">Score: ${certificateData.score}</text>
      <text x="${width / 2}" y="450" font-size="16" text-anchor="middle" font-family="'Arial', sans-serif" fill="#555">Issued on ${new Date().toLocaleDateString()}</text>
      <text x="${width / 2}" y="480" font-size="16" text-anchor="middle" font-family="'Arial', sans-serif" fill="#555">All rights reserved © ${certificateData.organizationName}</text>
    </svg>
  `);

  // Tạo ảnh từ SVG (nền + văn bản)
  const imageBuffer = await sharp(background)
    .png()
    .toBuffer();

  // Tải logo tổ chức nếu có
  let logoBuffer = null;
  if (certificateData.organizationAvt) {
    try {
      const logo = await sharp(certificateData.organizationAvt)
        .resize(100, 100)
        .toBuffer();
      logoBuffer = logo;
    } catch (error) {
      console.log('Error loading logo:', error);
    }
  }

  // Sử dụng sharp để tạo ảnh và vẽ logo (nếu có) vào vị trí mong muốn
  let certificate = sharp(imageBuffer);

  if (logoBuffer) {
    // Vẽ logo lên chứng chỉ
    certificate = certificate.composite([{
      input: logoBuffer,
      top: 400,
      left: (width / 2) - 50 // Đặt logo ở vị trí giữa
    }]);
  }

  // Lưu ảnh vào file tạm thời
  const imagePath = path.join(__dirname, 'certificate.png');
  await certificate.toFile(imagePath);

  // Tải ảnh lên Cloudinary
  const result = await cloudinary.uploader.upload(imagePath);

  // Xóa file ảnh tạm thời sau khi tải lên
  fs.unlinkSync(imagePath);

  // Trả về URL của ảnh trên Cloudinary
  return result.secure_url;
}

module.exports = createCertificateImage;

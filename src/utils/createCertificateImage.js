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
      <!-- Background -->
      <rect width="${width}" height="${height}" fill="#ffffff" />
      
      <!-- Border -->
      <rect x="20" y="20" width="${width - 40}" height="${height - 40}" fill="none" stroke="#4CAF50" stroke-width="10" rx="20" ry="20" />
      
      <!-- Title: COURSE CERTIFICATE -->
      <text x="${width / 2}" y="80" font-size="50" text-anchor="middle" font-family="'Arial', sans-serif" fill="#4CAF50" font-weight="bold">COURSE CERTIFICATE</text>
      
      <!-- Honors or regular certificate section -->
      ${certificateData.isBundle 
        ? `<text x="${width / 2}" y="140" font-size="24" text-anchor="middle" font-family="'Arial', sans-serif" fill="#f39c12">WITH HONORS</text>`
        : `<text x="${width / 2}" y="140" font-size="24" text-anchor="middle" font-family="'Arial', sans-serif" fill="#34495e">Course Certificate</text>`}

      <!-- User Name -->
      <text x="${width / 2}" y="200" font-size="40" text-anchor="middle" font-family="'Times New Roman', serif" fill="#34495e">${certificateData.userName}</text>
      
      <!-- Course Name -->
      <text x="${width / 2}" y="250" font-size="28" text-anchor="middle" font-family="'Georgia', serif" fill="#34495e">For successfully completing the course</text>
      <text x="${width / 2}" y="290" font-size="32" text-anchor="middle" font-family="'Georgia', serif" fill="#2ecc71">${certificateData.courseName}</text>

      <!-- Date -->
      <text x="${width / 2}" y="370" font-size="18" text-anchor="middle" font-family="'Arial', sans-serif" fill="#555">Issued on ${new Date().toLocaleDateString()}</text>
      
      <!-- Footer Text -->
      <text x="${width / 2}" y="420" font-size="16" text-anchor="middle" font-family="'Arial', sans-serif" fill="#555">All rights reserved © ${certificateData.organizationName}</text>

      <!-- Verification Link -->
      <text x="${width / 2}" y="470" font-size="14" text-anchor="middle" font-family="'Arial', sans-serif" fill="#3498db">Verify at: ${certificateData.verificationLink}</text>
      
      <!-- Seal (Circular section with brand) -->
      <circle cx="${width / 2}" cy="530" r="40" fill="#ffffff" stroke="#4CAF50" stroke-width="3"/>
      <text x="${width / 2}" y="535" font-size="16" text-anchor="middle" font-family="'Arial', sans-serif" fill="#2c3e50">${certificateData.organizationName}</text>
    </svg>
  `);

  // Tạo ảnh từ SVG
  const imageBuffer = await sharp(background)
    .png()
    .toBuffer();

  // Kiểm tra và tải logo tổ chức nếu có
  let logoBuffer = null;
  if (certificateData.organizationAvt) {
    try {
      // Nếu có logo tổ chức, resize và lấy buffer ảnh
      const logo = await sharp(certificateData.organizationAvt)
        .resize(100, 100)  // Thay đổi kích thước logo nếu cần
        .toBuffer();
      logoBuffer = logo;
    } catch (error) {
      console.log('Error loading logo:', error);
    }
  }

  // Tạo ảnh cuối cùng từ buffer của nền SVG
  let certificate = sharp(imageBuffer);

  // Nếu có logo tổ chức, composite logo vào vị trí thích hợp
  if (logoBuffer) {
    certificate = certificate.composite([{
      input: logoBuffer,
      top: 300,  // Vị trí logo tổ chức
      left: (width / 2) - 50  // Căn giữa logo
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

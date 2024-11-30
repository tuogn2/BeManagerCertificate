const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

async function createCourseCertificate(certificateData) {
  const width = 850;
  const height = 600;

  // Chọn màu viền dựa trên loại chứng chỉ
  const borderColor = certificateData.isBundle ? "#28A745" : "#007BFF"; // Xanh lá đậm cho Bundle, xanh dương đậm cho Course

  // Tạo nền với màu sáng như #f7f7f7
  const backgroundBuffer = Buffer.from(`
    <svg width="${width}" height="${height}">
      <rect width="${width}" height="${height}" fill="#f7f7f7" />
      
      <!-- Viền chứng chỉ với màu tùy chọn -->
      <rect x="20" y="20" width="${width - 40}" height="${height - 40}" fill="none" stroke="${borderColor}" stroke-width="10" rx="20" ry="20" />
      
      <!-- Tiêu đề chứng chỉ -->
      <text x="${width / 2}" y="80" font-size="60" text-anchor="middle" font-family="'Montserrat', sans-serif" fill="#333" font-weight="bold">COURSE CERTIFICATE</text>
      
      <!-- Phần khóa học hoặc chứng chỉ với danh dự -->
      ${certificateData.isBundle
        ? `<text x="${width / 2}" y="160" font-size="28" text-anchor="middle" font-family="'Roboto', sans-serif" fill="#f39c12">WITH HONORS</text>`
        : `<text x="${width / 2}" y="160" font-size="28" text-anchor="middle" font-family="'Roboto', sans-serif" fill="#333">This certificate is proudly presented to</text>`
      }

      <!-- Tên người nhận chứng chỉ -->
      <text x="${width / 2}" y="240" font-size="50" text-anchor="middle" font-family="'Times New Roman', serif" fill="#333">${certificateData.userName}</text>
      
      <!-- Tên khóa học -->
      <text x="${width / 2}" y="300" font-size="30" text-anchor="middle" font-family="'Georgia', serif" fill="#333">For successfully completing the course</text>
      <text x="${width / 2}" y="350" font-size="40" text-anchor="middle" font-family="'Georgia', serif" fill="#333">${certificateData.courseName}</text>

      <!-- Nếu là khóa học, hiển thị điểm -->
      ${!certificateData.isBundle && certificateData.score
        ? `<text x="${width / 2}" y="400" font-size="28" text-anchor="middle" font-family="'Georgia', serif" fill="#333">With a score of ${certificateData.score}</text>`
        : ''
      }

      <!-- Ngày cấp chứng chỉ -->
      <text x="${width / 2}" y="420" font-size="20" text-anchor="middle" font-family="'Arial', sans-serif" fill="#333">Issued on ${new Date().toLocaleDateString()}</text>

      <!-- Chân trang -->
      <text x="${width / 2}" y="460" font-size="18" text-anchor="middle" font-family="'Arial', sans-serif" fill="#333">All rights reserved © ${certificateData.organizationName}</text>
    </svg>
  `);

  // Tạo ảnh từ SVG
  const imageBuffer = await sharp(backgroundBuffer).png().toBuffer();

  // Tạo ảnh cuối cùng từ văn bản
  let certificate = sharp(imageBuffer);

  // Lưu ảnh vào file tạm thời
  const imagePath = path.join(__dirname, "certificate.png");
  await certificate.toFile(imagePath);

  // Tải ảnh lên Cloudinary
  const result = await cloudinary.uploader.upload(imagePath);

  // Xóa file ảnh tạm thời sau khi tải lên
  fs.unlinkSync(imagePath);

  // Trả về URL của ảnh trên Cloudinary
  return result.secure_url;
}

module.exports = createCourseCertificate;

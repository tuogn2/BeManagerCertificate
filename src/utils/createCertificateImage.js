const puppeteer = require("puppeteer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// cloudinary.config({
//   cloud_name: "your_cloud_name",
//   api_key: "your_api_key",
//   api_secret: "your_api_secret",
// });

async function createCertificateImage(certificateData) {
  // Tạo trình duyệt và trang mới
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Tạo nội dung HTML cho chứng chỉ
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate of Completion</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
      .certificate-container {
        max-width: 850px;
        padding: 40px;
        border: 10px solid #4CAF50;
        border-radius: 20px;
        background-color: #f7f7f7;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        text-align: center;
      }
      .certificate-header h1 {
        font-family: 'Times New Roman', serif;
        font-size: 48px;
        font-weight: bold;
        color: #2c3e50;
      }
      .certificate-subtext {
        font-family: 'Arial', sans-serif;
        font-size: 18px;
        margin-top: 20px;
        color: #777;
      }
      .certificate-content h2 {
        font-family: 'Georgia', serif;
        font-size: 36px;
        color: #34495e;
        margin-bottom: 10px;
      }
      .certificate-content h3 {
        font-family: 'Georgia', serif;
        font-size: 28px;
        color: #16a085;
      }
      .certificate-footer {
        margin-top: 30px;
        font-family: 'Arial', sans-serif;
        font-size: 16px;
        color: #555;
      }
      .organization-info {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
      }
      .organization-info img {
        border-radius: 50%;
        width: 80px;
        height: 80px;
        margin-right: 20px;
      }
      .organization-info h4 {
        font-family: 'Arial', sans-serif;
        font-size: 24px;
        color: #333;
        margin-bottom: 0;
      }
      .certificate-content p {
        font-size: 20px;
        color: #555;
      }
    </style>
  </head>
  <body>
    <div class="certificate-container">
      <div class="certificate-header">
        <h1>Certificate of Completion</h1>
        <p class="certificate-subtext">This certificate is proudly presented to</p>
      </div>
      <div class="certificate-content">
        <h2>${certificateData.userName}</h2>
        <p>For successfully completing the course</p>
        <h3>${certificateData.courseName}</h3>
        <p>With a score of <strong>${certificateData.score}</strong></p>
      </div>
      <div class="organization-info">
        <img src="${certificateData.organizationAvt}" alt="Organization Logo">
        <div>
          <h4>${certificateData.organizationName}</h4>
          <p>Issued on ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
      <div class="certificate-footer">
        <p>All rights reserved © ${certificateData.organizationName}</p>
      </div>
    </div>
  </body>
  </html>
  `;
  
  // Đặt nội dung HTML vào trang
  await page.setContent(htmlContent);
  // Tạo đường dẫn cho file ảnh tạm thời
  const imagePath = path.join(__dirname, "certificate.png");

  // Chụp màn hình và lưu lại thành file ảnh
  await page.screenshot({ path: imagePath });

  // Đóng trình duyệt
  await browser.close();

  // Tải ảnh lên Cloudinary
  const result = await cloudinary.uploader.upload(imagePath);
  // Xóa file ảnh tạm thời
  fs.unlinkSync(imagePath);
  // Trả về URL của ảnh trên Cloudinary
  return result.secure_url;
}

module.exports = createCertificateImage;

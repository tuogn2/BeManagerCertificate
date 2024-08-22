const puppeteer = require("puppeteer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: "your_cloud_name",
  api_key: "your_api_key",
  api_secret: "your_api_secret",
});

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
      max-width: 800px;
      margin: auto;
      padding: 20px;
      border: 2px solid #ddd;
      border-radius: 8px;
      background-color: #f9f9f9;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .certificate-header {
      text-align: center;
      margin-bottom: 20px;
    }
    .certificate-content {
      text-align: center;
    }
    .certificate-content h2 {
      margin: 10px 0;
      font-weight: bold;
    }
    .certificate-content h3 {
      margin: 10px 0;
    }
    .certificate-footer {
      margin-top: 20px;
      text-align: center;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="container certificate-container">
    <div class="certificate-header">
      <h1>Certificate of Completion</h1>
    </div>
    <div class="certificate-content">
      <p>This is to certify that</p>
      <h2>${certificateData.userName}</h2>
      <p>has successfully completed the test</p>
      <h3>${certificateData.testName}</h3>
      <p>Score: ${certificateData.score}</p>
    </div>
    <div class="certificate-footer">
      <p>Issued on ${new Date().toLocaleDateString()}</p>
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

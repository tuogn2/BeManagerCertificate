const nodemailer = require('nodemailer');

// Hàm để gửi email
const sendEmail = async (toEmail, subject, message) => {
  try {
    // Thiết lập transporter (SMTP server)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Hoặc sử dụng SMTP server khác
      auth: {
        user: process.env.EMAIL_USER, // Địa chỉ email của bạn
        pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng (không phải mật khẩu email thông thường)
      },
    });

    // Thiết lập nội dung email
    const mailOptions = {
      from: process.env.EMAIL_USER, // Địa chỉ người gửi
      to: toEmail, // Địa chỉ người nhận
      subject: subject, // Chủ đề email
      text: message, // Nội dung email
    };

    // Gửi email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info.response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendEmail };

const users = require("../models/User");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");

class userController {
  async getAlluser(req, res) {
    try {
      // Get current page and limit from query, defaulting to page 1 and limit 6
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;
      const skip = (page - 1) * limit;

      // Get search query from the request
      const searchQuery = req.query.search || ""; // Default to empty string if no search query

      // Build the filter object for searching
      const filter = searchQuery
        ? {
            $or: [
              { name: { $regex: searchQuery, $options: "i" } }, // Search by name (case insensitive)
              { email: { $regex: searchQuery, $options: "i" } }, // Search by email (case insensitive)
            ],
          }
        : {}; // If no search query, don't filter

      // Find users with the filter condition
      const usersList = await users
        .find(filter)
        .select("-password") // Exclude the 'password' field
        .limit(limit) // Limit the number of results
        .skip(skip); // Skip the number of results already shown

      // Count total users to calculate total pages
      const count = await users.countDocuments(filter);

      // Return the list of users and pagination information
      res.status(200).json({
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        users: usersList, // List of users
      });
    } catch (err) {
      console.error(err); // Log the error
      res.status(500).json(err); // If an error occurs, return 500 status with error
    }
  }
  async getuser(req, res, next) {
    try {
      const user = await users.findById(req.params.id).populate("enrollments"); // Populate trường enrollments

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Loại bỏ trường password khỏi kết quả trả về
      const { password, ...other } = user._doc;

      return res.status(200).json(other);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  }

  // Method to send verification code
  async sendCode(req, res) {
    const { email } = req.body;

    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000);

    // Send the code via email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tranhuyzaza@gmail.com",
        pass: "erup qefr rpyr ccjq",
      },
    });

    const mailOptions = {
      from: "tranhuyzaza@gmail.com",
      to: email,
      subject: "Password Reset Verification Code",
      text: `Your verification code is: ${code}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Error sending email" });
      }
      res.status(200).json({ message: "Verification code sent", code });
    });
  }

  // updateUser(req, res, next) {
  //   const userId = req.params.id;

  //   // Fields to update
  //   const updateData = {
  //     name: req.body.name,
  //     birthday: req.body.birthday,
  //     numberphone: req.body.numberphone,
  //     address: req.body.address,
  //     avt: req.body.avt,
  //   };

  //   users
  //     .findByIdAndUpdate(userId, updateData, { new: true }) // `new: true` returns the updated document
  //     .then((updatedUser) => {
  //       if (!updatedUser) {
  //         return res.status(404).json({ message: "User not found" });
  //       }
  //       const { password, ...other } = updatedUser._doc;
  //       return res.status(200).json(other);
  //     })
  //     .catch((err) => res.status(500).json(err));
  // }

  async updateUser(req, res) {
    const userId = req.params.id;
    const { name, birthday, numberphone, address, password } = req.body;
    const avt = req.file; // Lấy tệp từ req.file

    console.log("req.body:", avt);
    try {
      let updateData = { name, birthday, numberphone, address };

      // Nếu có mật khẩu mới, hash nó trước khi lưu
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      // Xử lý ảnh đại diện (nếu có)
      if (avt) {
        // Tải tệp lên Cloudinary
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: "image" }, (error, result) => {
              if (error) reject(error);
              resolve(result);
            })
            .end(avt.buffer);
        });

        // Lấy URL của ảnh và cập nhật
        updateData.avt = result.secure_url;
      }

      // Cập nhật người dùng
      const updatedUser = await users.findByIdAndUpdate(userId, updateData, {
        new: true,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Xóa mật khẩu trước khi trả về thông tin người dùng
      const { password: pwd, ...other } = updatedUser._doc;
      return res.status(200).json(other);
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // Change user password
  async changePassword(req, res, next) {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;

    try {
      const user = await users.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the current password is correct
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect current password" });
      }

      // Hash the new password and update it
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      await user.save();

      return res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  // Change user password
  async forgotpassword(req, res, next) {
    const userId = req.params.id;
    const { newPassword } = req.body;

    try {
      const user = await users.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Hash the new password and update it
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      await user.save();

      return res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  // async linkWallet(req, res) {
  //   const { walletAddress, userId } = req.body;

  //   try {
  //     // Kiểm tra xem địa chỉ ví có tồn tại trong cơ sở dữ liệu không
  //     const user = await users.findOne({ walletAddress });

  //     if (user) {
  //       // Địa chỉ ví đã được sử dụng
  //       res.status(400).json({ valid: false, message: 'Địa chỉ ví đã được liên kết với một tài khoản khác.' });
  //     } else {
  //       // Liên kết địa chỉ ví với tài khoản của người dùng
  //       const updatedUser = await users.findByIdAndUpdate(
  //         userId,
  //         { walletAddress },
  //         { new: true }
  //       );

  //       if (updatedUser) {
  //         res.status(200).json({ valid: true, message: 'Địa chỉ ví đã được liên kết với tài khoản của bạn.' });
  //       } else {
  //         res.status(500).json({ valid: false, message: 'Lỗi khi cập nhật tài khoản.' });
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Lỗi khi liên kết địa chỉ ví:', error);
  //     res.status(500).json({ valid: false, message: 'Lỗi máy chủ.' });
  //   }
  // }

  // async checkwallet(req, res) {
  //   const { walletAddress } = req.body;

  //   try {
  //     // Kiểm tra xem địa chỉ ví có tồn tại trong cơ sở dữ liệu không
  //     const user = await users.findOne({ walletAddress });

  //     if (user) {
  //       // Địa chỉ ví đã được sử dụng
  //       res.status(200).json({ valid: true, message: 'Địa chỉ ví đã được liên kết với một tài khoản.' });
  //     } else {
  //       // Địa chỉ ví không tồn tại trong cơ sở dữ liệu
  //       res.status(200).json({ valid: false, message: 'Địa chỉ ví không được liên kết với bất kỳ tài khoản nào.' });
  //     }
  //   } catch (error) {
  //     console.error('Lỗi khi kiểm tra địa chỉ ví:', error);
  //     res.status(500).json({ valid: false, message: 'Lỗi máy chủ.' });
  //   }
  // }
}

module.exports = new userController();

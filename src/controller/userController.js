const users = require("../models/User");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");
const Organization = require("../models/Organization"); // Đảm bảo đường dẫn đúng đến mô hình Organization


class userController {
  async getAlluser(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;
      const skip = (page - 1) * limit;
  
      const searchQuery = req.query.search || "";
  
      // Thêm điều kiện lọc để chỉ lấy người dùng có isActive là true
      const filter = {
        isActive: true,
        ...(searchQuery
          ? {
              $or: [
                { name: { $regex: searchQuery, $options: "i" } },
                { email: { $regex: searchQuery, $options: "i" } },
              ],
            }
          : {}),
      };
  
      const usersList = await users.find(filter).select("-password").limit(limit).skip(skip);
  
      const count = await users.countDocuments(filter);
  
      res.status(200).json({
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        users: usersList,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
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


  async getUserByEmail(req, res) {
    const { email } = req.params;

    try {
      const user = await users.findOne
      ({ email }).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
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

  async updateUser(req, res) {
    const userId = req.params.id;
    const { name, email, birthday, numberphone, address } = req.body;
    const avt = req.file;

    try {

        // Check if another user exists with the same email (excluding the current user)
        const existingUser = await users.findOne({ email, _id: { $ne: userId } });
        const existingOrganization = await Organization.findOne({ email, _id: { $ne: userId } });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use by another user." });
        }

        if (existingOrganization) {
            return res.status(400).json({ message: "Email is already in use " });
        }
        let updateData = { name, email, birthday, numberphone, address };

        // Handle avatar (if any)
        if (avt) {
            // Upload file to Cloudinary
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream({ resource_type: "image" }, (error, result) => {
                        if (error) reject(error);
                        resolve(result);
                    })
                    .end(avt.buffer);
            });

            // Get URL of the image and update
            updateData.avt = result.secure_url;
        }

        // Update user
        const updatedUser = await users.findByIdAndUpdate(userId, updateData, {
            new: true,
        });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove password before returning user info
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

  

  async deleteUser(req, res) {
    const userId = req.params.id;
  
    try {
      // Cập nhật trường isActive thành false để thực hiện xóa mềm
      const updatedUser = await users.findByIdAndUpdate(
        userId,
        { isActive: false },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      return res.status(200).json({ message: "User deactivated successfully" });
    } catch (error) {
      console.error("Error deactivating user:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
  
}

module.exports = new userController();

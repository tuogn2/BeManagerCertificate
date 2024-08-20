const users = require("../models/User");
const bcrypt = require("bcrypt");
class userController {
  getAlluser(req, res, next) {
    users
      .find()
      .select('-password') // Loại trừ trường 'password'
      .then((user) => {
        return res.status(200).json(user); // Trả về danh sách người dùng (không có mật khẩu) dưới dạng JSON
      })
      .catch((err) => res.status(500).json(err)); // Nếu có lỗi xảy ra, trả về mã 500 cùng với lỗi
}


  getuser(req, res, next) {
    users
      .findById(req.params.id)
      .then((user) => {
        const { password, ...orther } = user._doc;
        return res.status(200).json(orther);
      })
      .catch((err) => res.status(500).json(err));
  }

  updateUser(req, res, next) {
    const userId = req.params.id;

    // Fields to update
    const updateData = {
      name: req.body.name,
      birthday: req.body.birthday,
      numberphone: req.body.numberphone,
      address: req.body.address,
      avt: req.body.avt,
    };

    users
      .findByIdAndUpdate(userId, updateData, { new: true }) // `new: true` returns the updated document
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
        }
        const { password, ...other } = updatedUser._doc;
        return res.status(200).json(other);
      })
      .catch((err) => res.status(500).json(err));
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
}

module.exports = new userController();

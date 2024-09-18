const users = require("../models/User");
const Organization = require("../models/Organization");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/mailService");

const crypto = require("crypto");
class userController {
  async adduser(req, res, next) {
    const { name, email, password, role, birthday, numberphone, address, avt } =
      req.body;
    try {
      // Check if the user already exists
      const existingUser = await users.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new users({
        name,
        email,
        password: hashedPassword,
        role,
        birthday,
        numberphone,
        address,
        avt,
        certificates: [],
        enrollments: [],
      });

      await newUser.save();
      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser._id, role: newUser.role },
        process.env.JWT_Access_Key,
        { expiresIn: "350d" }
      );

      const userInfo = {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        birthday: newUser.birthday,
        numberphone: newUser.numberphone,
        address: newUser.address,
        avt: newUser.avt,
        certificates: newUser.certificates,
        createdAt: newUser.createdAt,
        enrollments: newUser.enrollments,
      };

      // Return token and user information
      return res.status(201).json({
        token,
        user: userInfo,
        message: "User registered successfully",
      });
    } catch (error) {
      console.error("Sign-up error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  //   async  login(req, res) {
  //     const { email, password } = req.body;

  //     try {
  //         // Check if the user exists
  //         const user = await users.findOne({ email }).populate('certificates').populate('enrollments');
  //         if (!user) {
  //             return res.status(400).json({ message: 'Invalid email or password' });
  //         }

  //         // Validate the password
  //         const isMatch = await bcrypt.compare(password, user.password);
  //         if (!isMatch) {
  //             return res.status(400).json({ message: 'Invalid email or password' });
  //         }

  //         // Generate JWT token
  //         const token = jwt.sign(
  //             { userId: user._id, role: user.role },
  //             process.env.JWT_Access_Key,
  //             { expiresIn: '350d' }
  //         );

  //         // Exclude the password before sending user information
  //         const userInfo = {
  //             id: user._id,
  //             name: user.name,
  //             email: user.email,
  //             role: user.role,
  //             birthday: user.birthday,
  //             numberphone: user.numberphone,
  //             address: user.address,
  //             avt: user.avt,
  //             certificates: user.certificates,
  //             createdAt: user.createdAt,
  //             enrollments: user.enrollments,
  //         };

  //         // Return token and user information
  //         return res.status(200).json({ token, user: userInfo, message: 'Login successful' });

  //     } catch (error) {
  //         console.error('Login error:', error);
  //         res.status(500).json({ message: 'Server error' });
  //     }}
  async login(req, res) {
    const { email, password } = req.body;

    try {
      // Kiểm tra email có tồn tại trong bảng người dùng hay không
      let user = await users
        .findOne({ email })
        .populate("certificates")
        .populate("enrollments");

      // Nếu không có người dùng, tiếp tục kiểm tra tổ chức
      if (!user) {
        user = await Organization.findOne({ email })
          .populate("certificatesIssued")
          .populate("courseBundles");

        // Nếu không tìm thấy tổ chức, trả về lỗi
        if (!user) {
          return res
            .status(400)
            .json({ message: "Email hoặc mật khẩu không hợp lệ" });
        }
      }

      // Kiểm tra mật khẩu
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Email hoặc mật khẩu không hợp lệ" });
      }

      // Tạo JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_Access_Key,
        { expiresIn: "350d" }
      );

      // Loại bỏ mật khẩu trước khi gửi thông tin người dùng/tổ chức
      const userInfo = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        avt: user.avt,
        certificates: user.certificates || user.certificatesIssued,
        createdAt: user.createdAt,
        enrollments: user.enrollments || user.courseBundles,
      };

      // Trả về token và thông tin người dùng/tổ chức
      return res
        .status(200)
        .json({ token, user: userInfo, message: "Đăng nhập thành công" });
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }
  async loginWithGoogle(req, res) {
    const { email, name, avt } = req.body;

    try {
      // Check if the user already exists
      let user = await users.findOne({ email });

      // If not found, create a new user
      if (!user) {
        // Generate a random 8-character password
        const tempPassword = crypto.randomBytes(4).toString("hex"); // Generates a random 8-character string

        user = new users({
          name,
          email,
          password: await bcrypt.hash(tempPassword, 10), // Hash the temporary password
          role: "customer", // Default role or you can determine this dynamically
          avt,
          createdAt: new Date(),
          certificates: [],
          enrollments: [],
        });
        console.log(user);
        await user.save();

        // Send the temporary password to the user via email
        const subject = "Your Temporary Password";
        const message = `Hello ${name},\n\nYour temporary password is: ${tempPassword}\n\nPlease log in using this password and change it as soon as possible.`;
        await sendEmail(email, subject, message);
      } else {
        // Handle the case where a user is found
        // Optionally, you can send a message or handle this case as needed
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_Access_Key,
        { expiresIn: "350d" }
      );

      // Exclude sensitive data
      const userInfo = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        avt: user.avt,
        certificates: user.certificates,
        createdAt: user.createdAt,
        enrollments: user.enrollments,
      };

      // Return token and user information
      return res
        .status(200)
        .json({ token, user: userInfo, message: "Login successful" });
    } catch (error) {
      console.error("Google login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = new userController();

const express = require('express');
const route = express.Router();
const authController = require('../controller/authController');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API for user authentication
 */

/**
 * @swagger
 * /createuser:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên người dùng
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: Email của người dùng
 *                 example: johndoe@gmail.com
 *               password:
 *                 type: string
 *                 description: Mật khẩu người dùng
 *                 example: password123
 *               role:
 *                 type: string
 *                 description: Vai trò của người dùng
 *                 example: user
 *               birthday:
 *                 type: string
 *                 description: Ngày sinh của người dùng
 *                 example: 1995-01-01
 *               numberphone:
 *                 type: string
 *                 description: Số điện thoại của người dùng
 *                 example: 0987654321
 *               address:
 *                 type: string
 *                 description: Địa chỉ người dùng
 *                 example: 123 Main St
 *               avt:
 *                 type: string
 *                 description: Link ảnh đại diện của người dùng
 *                 example: avt.jpg
 *     responses:
 *       201:
 *         description: Người dùng đã đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                 user:
 *                   type: object
 *                   description: Thông tin người dùng
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID của người dùng
 *                     name:
 *                       type: string
 *                       description: Tên người dùng
 *                     email:
 *                       type: string
 *                       description: Email của người dùng
 *                     role:
 *                       type: string
 *                       description: Vai trò của người dùng
 *                     birthday:
 *                       type: string
 *                       description: Ngày sinh của người dùng
 *                     numberphone:
 *                       type: string
 *                       description: Số điện thoại của người dùng
 *                     address:
 *                       type: string
 *                       description: Địa chỉ của người dùng
 *                     avt:
 *                       type: string
 *                       description: Link ảnh đại diện
 *       400:
 *         description: Người dùng đã tồn tại
 *       500:
 *         description: Lỗi server
 */
route.post('/createuser', authController.adduser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email của người dùng
 *                 example: johndoe@gmail.com
 *               password:
 *                 type: string
 *                 description: Mật khẩu người dùng
 *                 example: password123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                 user:
 *                   type: object
 *                   description: Thông tin người dùng
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID của người dùng
 *                     name:
 *                       type: string
 *                       description: Tên người dùng
 *                     email:
 *                       type: string
 *                       description: Email của người dùng
 *                     role:
 *                       type: string
 *                       description: Vai trò của người dùng
 *                     birthday:
 *                       type: string
 *                       description: Ngày sinh của người dùng
 *                     numberphone:
 *                       type: string
 *                       description: Số điện thoại của người dùng
 *                     address:
 *                       type: string
 *                       description: Địa chỉ của người dùng
 *                     avt:
 *                       type: string
 *                       description: Link ảnh đại diện của người dùng
 *       400:
 *         description: Email hoặc mật khẩu không hợp lệ
 *       500:
 *         description: Lỗi server
 */
route.post('/login', authController.login);


/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *                 example: johndoe@gmail.com
 *               name:
 *                 type: string
 *                 description: User's name
 *                 example: John Doe
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: password123
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                 user:
 *                   type: object
 *                   description: User's information
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: User ID
 *                     name:
 *                       type: string
 *                       description: User's name
 *                     email:
 *                       type: string
 *                       description: User's email
 *                     role:
 *                       type: string
 *                       description: User's role
 *                     address:
 *                       type: string
 *                       description: User's address
 *                     avt:
 *                       type: string
 *                       description: User's avatar link
 *                     createdAt:
 *                       type: string
 *                       description: Date of account creation
 *                     enrollments:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Email already in use
 *       500:
 *         description: Server error
 */
route.post('/signup', authController.signup);
/**
 * @swagger
 * /login-with-google:
 *   post:
 *     summary: Đăng nhập hoặc đăng ký người dùng bằng Google
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email của người dùng
 *                 example: johndoe@gmail.com
 *               name:
 *                 type: string
 *                 description: Tên người dùng
 *                 example: John Doe
 *               avt:
 *                 type: string
 *                 description: Link ảnh đại diện của người dùng
 *                 example: avt.jpg
 *     responses:
 *       200:
 *         description: Đăng nhập hoặc đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                 user:
 *                   type: object
 *                   description: Thông tin người dùng
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID của người dùng
 *                     name:
 *                       type: string
 *                       description: Tên người dùng
 *                     email:
 *                       type: string
 *                       description: Email của người dùng
 *                     role:
 *                       type: string
 *                       description: Vai trò của người dùng
 *                     address:
 *                       type: string
 *                       description: Địa chỉ của người dùng
 *                     avt:
 *                       type: string
 *                       description: Link ảnh đại diện của người dùng
 *       500:
 *         description: Lỗi server
 */
route.post('/login-with-google', authController.loginWithGoogle);

module.exports = route;

const express = require("express");
const route = express.Router();
const userController = require('@controllers/userController'); // Sử dụng alias @controllers
const upload = require('@middleware/upload'); // Sử dụng alias @middleware
const middlewareController = require('@middleware/middlewareController'); // Sử dụng alias @middleware

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing users
 */

/**
 * @swagger
 * /users/send-code:
 *   post:
 *     tags: [Users]
 *     summary: Send a password reset verification code to user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address
 *     responses:
 *       200:
 *         description: Verification code sent
 *       500:
 *         description: Server error
 */
route.post("/send-code", userController.sendCode);

route.get("/getuserbyemail/:email", userController.getUserByEmail);

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users (excluding passwords)
 *     responses:
 *       200:
 *         description: List of all users
 *       500:
 *         description: Server error
 */
route.get("/",  userController.getAlluser);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
route.get("/:id", userController.getuser);

/**
 * @swagger
 * /users/change-infor/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update user information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               birthday:
 *                 type: string
 *               numberphone:
 *                 type: string
 *               address:
 *                 type: string
 *               avt:
 *                 type: string
 *     responses:
 *       200:
 *         description: User information updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
route.put("/change-infor/:id",middlewareController.verifyTokenAdminOrSelf, upload.single("avt"), userController.updateUser);

/**
 * @swagger
 * /users/change-password/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Change user password
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Incorrect current password
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
route.put("/change-password/:id", userController.changePassword);

route.put("/forgotpassword/:id", userController.forgotpassword);


route.delete('/:id' ,middlewareController.verifyTokenAdminOrSelf, userController.deleteUser);

module.exports = route;

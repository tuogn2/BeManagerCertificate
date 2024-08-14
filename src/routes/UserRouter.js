const express = require('express');
const route = express.Router();
const userController = require("../controller/userController");
const middlewareController = require("../controller/middlewareController");

 
// Update user information
route.put("/change-infor/:id",middlewareController.verifyToken, userController.updateUser);
// Change user password
route.put("/change-password/:id",middlewareController.verifyToken, userController.changePassword);
route.get('/',middlewareController.verifyToken, userController.getAlluser);

module.exports = route;

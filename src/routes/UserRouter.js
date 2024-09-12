const express = require('express');
const route = express.Router();
const userController = require("../controller/userController");
const middlewareController = require("../controller/middlewareController");

 
// Update user information
// route.post('/link-wallet', userController.linkWallet);
route.put("/change-infor/:id",middlewareController.verifyTokenUser, userController.updateUser);
// Change user password
route.put("/change-password/:id",middlewareController.verifyTokenUser, userController.changePassword);
route.get('/:id',middlewareController.verifyTokenUser, userController.getuser);
// route.post('/check-wallet', userController.checkwallet);
route.get('/', userController.getAlluser);
module.exports = route;

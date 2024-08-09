const users = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
class userController { 
  getusers(req, res, next) {
    users
      .find()
      .then((user) => {
        return res.status(200).json(user);
      })
      .catch((err) => res.status(500).json(err));
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

  

  
}

module.exports = new userController();

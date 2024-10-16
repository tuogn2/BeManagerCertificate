const jwt = require("jsonwebtoken");

class middlewareController {
  //verifyToken
  verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_Access_Key, (err, user) => {
        if (err) {
          return res.status(403).json("Token is not  valid");
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("You're not authenticated");
    }
  }

  // req.body.userId
  async verifyTokenStudent(req, res, next) {
    const token = req.headers.authorization;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_Access_Key, (err, user) => {
        if (err) {
          return res.status(403).json("Token is not  valid");
        }

        if (
          user.role !== "customer" &&
          (user.userId !== req.body.userId && user.userId !== req.params.id && user.userId && req.body.user)
        ) {
          return res.status(403).json("You're not a customer");
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("You're not authenticated");
    }
  }
  async verifyTokenOr(req, res, next) {
    const token = req.headers.authorization;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_Access_Key, (err, user) => {
        if (err) {
          return res.status(403).json("Token is not  valid");
        }

        if (
          user.role !== "organization" &&
          (user.userId !== req.body.organization)
        ) {
          return res.status(403).json("You're not a organization");
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("You're not authenticated");
    }
  }

  // req.param.id
  async verifyTokenAdmin(req, res, next) {
    const token = req.headers.authorization;
    console.log(token);
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_Access_Key, (err, user) => {
        if (err) {
          return res.status(403).json("Token is not  valid");
        }
        console.log(user);
        if (user.role !== "admin") {
          return res.status(403).json("You're not a admin");
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("You're not authenticated");
    }
  }

  async verifyTokenOrganizationOrAdmin(req, res, next) {
    const token = req.headers.authorization;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_Access_Key, (err, user) => {
        if (err) {
          return res.status(403).json("Token is not  valid");
        }
        if (user.role !== "organization" &&user.role !== "admin") {
          return res.status(403).json("You're not a organization");
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("You're not authenticated");
    }
  }
  async verifyTokenAdminOrSelf(req, res, next) {
    const token = req.headers.authorization;
    console.log(token);
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_Access_Key, (err, user) => {
        if (err) {
          return res.status(403).json("Token is not valid");
        }
        console.log(token);
        // Check if user is an admin or if the user is trying to delete their own account
        if (user.role !== "admin" && (user.userId !== req.params.id && user.userId !== req.body.userId)) {
          return res
            .status(403)
            .json("You're not authorized to perform this action");
        }

        req.user = user;
        next();
      });
    } else {
      return res.status(401).json("You're not authenticated");
    }
  }


  
}

module.exports = new middlewareController();

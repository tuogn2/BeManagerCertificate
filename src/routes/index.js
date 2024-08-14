
const UserRouter = require("./UserRouter");
const authRouter = require("./auth");
const userController = require("../controller/userController");

function router(app){
    app.use("/api/v1/users",UserRouter);
    app.use("/api/v1/auth",authRouter);
    // app.use("/profiles",profile);
    // app.use("/store",store);
    // app.use("/product",product);

    
    // app.get("/",userController.getAlluser);

}
 
module.exports = router

const UserRouter = require("./UserRouter");
const authRouter = require("./auth");


function router(app){
    app.get("/",(req,res)=>{
        res.send("Hello World")
    })
    app.use("/users",UserRouter);
    app.use("/auth",authRouter);
    // app.use("/profiles",profile);
    // app.use("/store",store);
    // app.use("/product",product);
}
 
module.exports = router
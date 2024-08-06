

function router(app){
    app.get("/",(req,res)=>{
        res.send("Hello World")
    })
    // app.use("/users",user);
    // app.use("/profiles",profile);
    // app.use("/store",store);
    // app.use("/product",product);
      
}
 
module.exports = router
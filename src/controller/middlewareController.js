const jwt = require("jsonwebtoken")

class middlewareController {
    //verifyToken 
    verifyToken(req,res,next){
        const token = req.headers.token
        if(token){
            const accessToken = token.split(" ")[1]
            jwt.verify(accessToken,process.env.JWT_Access_Key,(err,user)=>{
                if(err){
                   return res.status(403).json("Token is not  valid")
                }
                req.user = user
                next()
            })
        }
        else{
            res.status(401).json("You're not authenticated")
        }
    }

    async verifyTokenUser(req, res, next) {
        const token = req.headers.token
        if(token){
            const accessToken = token.split(" ")[1]
            jwt.verify(accessToken,process.env.JWT_Access_Key,(err,user)=>{
                if(err){
                   return res.status(403).json("Token is not  valid")
                }

                console.log(user)
                if(user.role !== "customer" || user.userId !== req.params.id){
                    return res.status(403).json("You're not a customer")
                }
                req.user = user
                next()
            })
        }
        else{
            res.status(401).json("You're not authenticated")
        }
    }
}

module.exports = new middlewareController();
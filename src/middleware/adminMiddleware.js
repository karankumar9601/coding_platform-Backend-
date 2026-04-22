const jwt=require("jsonwebtoken")
const User=require("../Model/user")
const redisClient=require("../config/redishConfig")

const adminMiddlewareAuth= async(req,res,next)=>{
  try {
     const {token}=req.cookies;
     if (!token) {
        return res.status(404).json({
            success:false,
            message:"token not Found"
        })
     }

     const blacklist=await redisClient.get(`blacklist${token}`)
     if (blacklist) {
        return res.status(401).json({
            success:false,
            message:"token is already block"
        })
     }
    const payload =jwt.verify(token,process.env.JWT_SECRET_KEY)
    const user =await User.findById(payload._id)
    if (!user) {
        return res.status(404).json({
            success:false,
            message:"user not Found"
        })
    }
    if (user.role!=='admin') {
       return res.status(403).json({
        success:false,
        message:"Access denide"
       }) 
    }
    req.result=payload;
    next();
  } catch (error) {
    res.status(403).json({
        success:false,
        message:error.message
    })
  }
}

module.exports=adminMiddlewareAuth;
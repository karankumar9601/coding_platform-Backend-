
const express = require("express")
const userRoute = express.Router();
const { register, login, logout, getProfile,deleteProfile,allUser,updateProfile} = require("../controller/usersAuth/userAuth")
const authMiddleware=require("../middleware/authMiddleware")
const adminMiddlewareAuth=require("../middleware/adminMiddleware")

userRoute.post('/register', register);
userRoute.post('/login', login);
userRoute.post('/logout',authMiddleware, logout);
userRoute.get('/userProfile/:id',authMiddleware, getProfile);
userRoute.delete('/deleteProfile',authMiddleware,deleteProfile)
userRoute.get('/allUser',adminMiddlewareAuth,allUser)
userRoute.get('/check_auth',authMiddleware,async(req,res)=>{
    const reply={
        firstName:req.user.firstName,
        emailId:req.user.emailId,
        _id:req.user._id,
        role:req.user.role
    }
    return res.status(200).json({
        success:true,
        message:"user Already login",
        data:reply
    })
})
userRoute.patch('/userUpdate/:id',authMiddleware,updateProfile)


module.exports = userRoute;
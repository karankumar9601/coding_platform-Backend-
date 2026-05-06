
const express = require("express")
const userRoute = express.Router();
const { register, login, logout, getProfile,deleteProfile } = require("../controller/usersAuth/userAuth")
const authMiddleware=require("../middleware/authMiddleware")

userRoute.post('/register', register);
userRoute.post('/login', login);
userRoute.post('/logout',authMiddleware, logout);
userRoute.get('/userProfile/:id',authMiddleware, getProfile);
userRoute.delete('/deleteProfile',authMiddleware,deleteProfile)
userRoute.get('/check_auth',authMiddleware,async(req,res)=>{
    const reply={
        firstName:req.user.firstName,
        emailId:req.user.emailId,
        _id:req.user._id
    }
    return res.status(200).json({
        success:true,
        message:"user Already login",
        data:reply
    })
})

module.exports = userRoute;
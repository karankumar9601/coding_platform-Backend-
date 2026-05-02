
const express = require("express")
const userRoute = express.Router();
const { register, login, logout, getProfile,deleteProfile } = require("../controller/usersAuth/userAuth")
const authMiddleware=require("../middleware/authMiddleware")

userRoute.post('/register', register);
userRoute.post('/login', login);
userRoute.post('/logout',authMiddleware, logout);
userRoute.get('/userProfile/:id',authMiddleware, getProfile);
userRoute.delete('/deleteProfile',authMiddleware,deleteProfile)

module.exports = userRoute;
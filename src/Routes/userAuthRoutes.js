
const express = require("express")
const userRoute = express.Router();
const { register, login, logout, getProfile } = require("../controller/usersAuth/userAuth")
const authMiddleware=require("../middleware/authMiddleware")

userRoute.post('/register', register);
userRoute.post('/login', login);
userRoute.post('/logout',authMiddleware, logout);
userRoute.get('/userProfile/:id',authMiddleware, getProfile);

module.exports = userRoute;
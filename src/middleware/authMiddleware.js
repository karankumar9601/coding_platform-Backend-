const jwt = require("jsonwebtoken")
const User = require("../Model/user")
const redisClient = require("../config/redishConfig");
const { json } = require("express");

const authMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(404).json({
                success: false,
                message: "token not found"
            })
        }
        const blacklist = await redisClient.get(`blacklist${token}`)
        if (blacklist) {
            return res.status(401).json({
                success: false,
                message: "token is invalid or logout out"
            })
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await User.findById(payload._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not Found"
            })
        }

        if (user.role !== 'admin'&& user.role!=='user') {
            return res.status(403).json({
                success: false,
                message: "Access denide"
            })
        }
        req.user = user
        next();

    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        })
    }

}

module.exports = authMiddleware;
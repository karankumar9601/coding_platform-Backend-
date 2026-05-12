
const User = require("../../Model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisClient = require("../../config/redishConfig")
const validator = require("validator")
const submitProblem = require("../../Model/subimission")

const register = async (req, res) => {
    try {
        const { firstName, emailId, password } = req.body;
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({
                success: false,
                message: "week password"
            })
        }
        if (!validator.isEmail(emailId)) {
            return res.status(400).json({
                success: false,
                message: "invalid Email"
            })
        }
        if (!firstName || !emailId || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = 'user'
        const user = await User.create(req.body)
        return res.status(201).json({
            success: true,
            message: "Register Successfully",
            data: { emailId: user.emailId, password: user.password }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const login = async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if (!emailId || !password) {
            return res.status(400).json({
                success: false,
                message: "Invalid fields"
            })
        }

        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not Found"
            })
        }
        const match = bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({
                success: false,
                messsage: "Invalide corenditals"
            })
        }
        const token = jwt.sign({ _id: user._id, emailId: user.emailId, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 60 })
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 })
        return res.status(200).json({
            success: true,
            message: "login successfully",
            data: { _id: user._id, email: user.emailId, name: user.firstName, role: user.role }
        })




    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const logout = async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(404).json({
                success: false,
                message: "token not found"
            })
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
        await redisClient.set(`blacklist:${token}`, payload.exp)
        res.cookie('token', null, { expires: new Date(Date.now()) })
        return res.status(200).json({
            success: true,
            message: "logout successfully"
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const getProfile = async (req, res) => {
    try {
        const { id } = req.params
        const { _id } = req.user;

        if (id != _id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorize users"
            })
        }
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "user record fetch",
            data: user
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const deleteProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        await User.findByIdAndDelete(userId);
        await submitProblem.deleteMany({ userId: userId });
        res.status(200).json({
            success: true,
            message: "deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const allUser = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query
        page = parseInt(page)
        limit = parseInt(limit)
        if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
            return res.status(400).json({
                success: false,
                message: "page and limit must be positive numbers"
            });
        }
        const skip = (page - 1) * limit
        const user = await User.find().skip(skip).limit(limit).select("firstName lastName emailId role problemSolved")
        const updatedUsers = user.map(user => ({
            firstName: user.firstName,
            lastName: user.lastName,
            emailId: user.emailId,
            role: user.role,
            problemSolvedCount: user.problemSolved.length
        }));
        if (updatedUsers.length===0) {
            return res.status(404).json({
                success:false,
                message:"user not found"
            })
        }
        const totalUser=await User.countDocuments();
        if (totalUser===0) {
            return res.status(404).json({
                success:false,
                message:"User not Found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"All User Fetch",
            page,
            limit,
            totalUser,
            totalPage:Math.ceil(totalUser/limit),
            data:updatedUsers
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}


module.exports = { register, login, logout, getProfile, deleteProfile, allUser }
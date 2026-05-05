const mongoose = require("mongoose")
const { Schema } = mongoose;
const { trim, isLowercase } = require("validator");
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: [3, "fullName is minimum 3 chatacter"],
        maxLength: [16, "fullName is contains maximum 16 charcter"]
    },
    lastName: {
        type: String,
        trim: true,
        minLength: [3, "fullName is minimum 3 chatacter"],
        maxLength: [16, "fullName is contains maximum 16 charcter"]

    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        isLowercase: true

    },
    age: {
        type: Number,
        min: [10, "Age must be at least 10"],
        max: [60, "Age must be less than 60"],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    problemSolved: {
        type: [{
            type:Schema.Types.ObjectId,
            ref:"problem"
        }]
    },
    password: {
        type: String,
        required: true,
    }
}, { timestamps: true })

const User = mongoose.model('user', userSchema)
module.exports = User;

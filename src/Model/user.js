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
        required: true,
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
        type:Number,
        required:true

    },
    role: {
        type:String,
        enum: ['user', 'admin'],
        default:User
    },
    problemID: {
        type:String
    }
}, { timeseries: true })

const User = mongoose.model('user', userSchema)
module.exports = User;

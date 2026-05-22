const mongoose = require("mongoose")
const { Schema } = mongoose

const videoSchema = new Schema({
    problemId: {
        type: Schema.Types.ObjectId,
        ref: "problem",
        required: true,
        index:true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        index:true
    },
    cloudinaryPublicId: {
        type: String,
        required: true
    },
    secureURL: {
        type: String,
        required: true
    },
    thumbnailURL: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    }

},{timestamps:true})

module.exports = mongoose.model("VideoSolution", videoSchema);
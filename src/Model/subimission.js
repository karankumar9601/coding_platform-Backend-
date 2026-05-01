const mongoose = require("mongoose")
const { Schema } = mongoose

const submissionSchema = new Schema({
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'problem',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true,
        enum: ['javascript', 'java', 'c++', 'c']
    },
    runtime: {
        type: Number,
        default: 0
    },
    memory: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'wrong', 'error'],
        default: 'pending'
    },
    errorMessage: {
        type: String,
        default: ''
    },
    testCasePassed: {
        type: Number,
        default: 0
    },
    totalTestCase: {
        type: Number,
        default: 0
    }

}, { timestamps: true })

const submitProblem = mongoose.model('solve_problem', submissionSchema);
module.exports = submitProblem
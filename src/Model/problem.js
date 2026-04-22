const mongoose = require("mongoose");
const { Schema } = mongoose
const User = require("./user")

const ProblemSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['easy', 'medium', 'hard']
    },
    tag: {
        type: String,
        required: true,
        enum: ['array', 'graph', 'linkedlist', 'stack','dp','string']
    },
    visibleTestCase: [
        {
            input: { type: String, required: true },
            output: { type: String, required: true },
            Explanation: { type: String, required: true }
        }
    ],
    invisibleTestCase: [
        {
            input: { type: String, required: true },
            output: { type: String, required: true }
        }
    ],
    referenceSolution: [

        {
            language: { type: String, required: true },
            completeCode: { type: String, required: true }
        }

    ],
    startCode: [
        {
            language: { type: String, required: true },
            initialCode: { type: String, required: true }
        }
    ],
    problemCreator: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, { timestamps: true })

const Problem = mongoose.model('problem', ProblemSchema)

module.exports = Problem;
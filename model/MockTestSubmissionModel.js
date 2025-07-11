const mongoose = require('mongoose');
const submissionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MockTestModel',
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    answers: [
        {
            questionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'TestQuestions',
                required: true
            },
            selectedOption: {
                type: String,
                required: true
            }
        }
    ],
    score: {
        type: Number,
        default: 0
    },
    isSubmitted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

const SubmissionModel = mongoose.model("Submissions", submissionSchema);

module.exports = { SubmissionModel };

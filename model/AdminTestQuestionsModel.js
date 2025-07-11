const mongoose = require('mongoose');

const Options = ["A", "B", "C", "D"]

const testQuestionSchema = new mongoose.Schema({
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'MockTestModel', required: true },
    questions: { type: String, required: true },
    options: {
        type: [String],
        validate: {
            validator: function (arr) {
                return arr.length === 4 && arr.every(opt => opt && opt.trim().length > 0);
            },
            message: 'Exactly 4 non-empty options are required'
        }
    },
    correctAnswer: {
        type: String,
        required: true,
        enum: Options
    }

}, { timestamps: true });

function arrayLimit(val) {
    return val.length === 4;
}

const TestQuestionModel = mongoose.model("TestQuestions", testQuestionSchema);

module.exports = {
    Options,
    TestQuestionModel
}
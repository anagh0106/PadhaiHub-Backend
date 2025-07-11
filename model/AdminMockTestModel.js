const mongoose = require('mongoose');
const standards = ["11", "12"];
const subjects = ["Mathematics", "Physics", "Chemistry", "Biology"];
const groups = ["A", "B"];


const mockTestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    standard: { type: String, required: true, enum: standards },
    subject: { type: String, required: true, enum: subjects },
    group: { type: String, required: true, enum: groups },
    chapter: { type: String, required: true },
    date: { type: Date, required: true },
    totalQuestion: { type: Number, required: true },
    marksPerQuestion: { type: Number, required: true },
    negativeMarks: { type: Number, required: true },
    duration: { type: Number, required: true },
    startTime: {
        type: String,
        required: true,
    },
    totalMarks: {
        type: Number,
        default: function () {
            return this.totalQuestion * this.marksPerQuestion;
        }
    }
}, { timestamps: true });

mockTestSchema.index(
    { title: 1, subject: 1, standard: 1, group: 1 },
    { unique: true }
);
const MockTestModel = mongoose.model("MockTestModel", mockTestSchema);
module.exports = {
    MockTestModel,
    standards,
    subjects,
    groups
};

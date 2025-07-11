const mongoose = require("mongoose");
const Subjects = ["Mathematics", "Physics", "Chemistry", "Biology"]

const ClassManagementSchema = new mongoose.Schema(
    {
        subject: {
            type: String,
            required: true,
            enum: Subjects
        },
        standard: {
            type: String,
            required: true,
            enum: ["11", "12"]
        },
        faculty: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FacultyData",
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        room: {
            type: String,
            required: true,
            enum: ["101", "102", "103", "104", "201", "202", "203", "204"]
        },
        date: {
            type: String,
            required: true,
        },

    },
    {
        timestamps: true,
    }
);

const classModel = mongoose.model("ClassManagement", ClassManagementSchema);
module.exports = {
    Subjects,
    classModel
}

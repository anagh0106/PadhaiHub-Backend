const mongoose = require("mongoose");

const AdvanceCourseSchema = new mongoose.Schema({
    coursename: {
        type: String,
        required: true,
        enum: ["NEET", "JEE", "Board+GUJCET"],
    },
    courseid: {
        type: Number,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("AdvanceCourse", AdvanceCourseSchema);

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Course title is required"]
    },
    subjects: {
        type: [String],
        required: [true, "Subjects are required"],
        validate: v => Array.isArray(v) && v.length > 0
    },
    features: {
        type: [String],
        required: [true, "Features are required"],
        validate: v => Array.isArray(v) && v.length > 0
    },
    price: {
        type: Number,
        required: [true, "Price is required"]
    },
    category: {
        type: String,
        required: [true, "Course category is required"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CourseCard', courseSchema);

const mongoose = require('mongoose');
const schema = mongoose.Schema

const reviewSchema = new schema({
    name: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    grade: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("review", reviewSchema)
const mongoose = require("mongoose")

const FacultySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: true,
    },
    qualification: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
        unique: true,
    },
})

module.exports = mongoose.model("FacultyData", FacultySchema)

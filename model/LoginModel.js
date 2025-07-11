const mongoose = require("mongoose");
const schema = mongoose.Schema;

const LoginDetailSchema = new schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    studentId: {
        type: String,
        default: null,
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("login", LoginDetailSchema);

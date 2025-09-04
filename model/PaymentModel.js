const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
    studentInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudentInfo",
    },
    email: {
        type: String,
        required: true,
        unique: true, // same email dobara na ho
        lowercase: true, // auto lower-case
        trim: true, // extra space hata dega
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"], // regex validation
    },
});

const Email = mongoose.model("CoursePurchase", emailSchema);

module.exports = Email;

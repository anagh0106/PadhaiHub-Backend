const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
    studentData: {
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
    isPermitted:{
        type:Boolean,
        default:false
    }
});

const PayModel = mongoose.model("CoursePurchase", emailSchema);

module.exports = PayModel;

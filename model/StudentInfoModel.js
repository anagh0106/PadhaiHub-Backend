const mongoose = require("mongoose");
const schema = mongoose.Schema;

const StudentInfoSchema = new schema({
    studentId: { type: String, required: true },
    email: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    grade: {
        type: String,
        enum: ['11', '12'],
        required: true,
        immutable: true
    },
    group: {
        type: String,
        enum: ['A', 'B'], // ✅ ye frontend se match karega
        required: true,
        immutable: true
    }
    // profile: {
    //     type: String,
    //     default: null
    // }
}, {
    timestamps: true
});

module.exports = mongoose.model("StudentInfo", StudentInfoSchema);

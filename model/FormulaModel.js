const mongoose = require("mongoose");

const FormulaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    formula: { type: String, required: true },
    subject: {
        type: String,
        enum: ["Maths", "Physics", "Chemistry", "Biology"],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Formula", FormulaSchema);

const mongoose = require("mongoose")

const degrees = [
    "B.Sc. (Physics)",
    "B.Sc. (Chemistry)",
    "B.Sc. (Mathematics)",
    "B.Sc. (Biology)",
    "B.Sc. (Zoology)",
    "B.Sc. (Botany)",
    "M.Sc. (Physics)",
    "M.Sc. (Chemistry)",
    "M.Sc. (Mathematics)",
    "M.Sc. (Biology)",
    "B.Tech (Engineering – Science Background)",
    "M.Tech (Engineering – Science Background)",
    "B.Ed.",
    "M.Ed.",
    "Ph.D. (Physics)",
    "Ph.D. (Chemistry)",
    "Ph.D. (Mathematics)",
    "Ph.D. (Biology)",
    "NET Qualified (UGC/CSIR)",
    "CTET/TET Qualified"
];

const subjects = ["Mathematics", "Chemistry", "Physics", "Biology"];

const experience = ["3+ years", "6+ years", "9+ years"];

const FacultySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
        enum: subjects
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
        enum: degrees
    },
    experience: {
        type: String,
        required: true,
        enum: experience
    },
    contact: {
        type: String,
        required: true,
        unique: true,
    },
});

module.exports = {
    FacultyModel: mongoose.model("FacultyData", FacultySchema),
    subjects,
    experience,
    degrees
}

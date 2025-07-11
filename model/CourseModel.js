const mongoose = require("mongoose")

const CourseSubjectSchema = mongoose.Schema({
    subjectName: {
        type: String,
        required: true
    }
})

const courseSubscriptionCounterSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    counter: {
        type: Number,
        required: true,
    }
})

// ✅ Models create kar ke export karenge:
const CourseModel = mongoose.model("CourseSubjects", CourseSubjectSchema)
const CourseSubscriptionModel = mongoose.model("SubscriptionCounter", courseSubscriptionCounterSchema)

// ✅ Multiple exports ek object me:
module.exports = {
    CourseModel,
    CourseSubscriptionModel
}

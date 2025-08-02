const mongoose = require("mongoose");
const category = ["General", "Mathematics", "Physics", "Chemistry", "Biology"]
const priority = ["Low", "Medium", "High", "Urgent"]
// Task Subdocument Schema
const taskSchema = new mongoose.Schema({
    taskId: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
        minlength: 5
    },
    category: {
        type: String,
        enum: category,
        required: true,
        default: "General"
    },
    priority: {
        type: String,
        enum: priority,
        required: true,
        default: "Medium"
    },
    duedate: {
        type: Date,
        required: true
    },
    text: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    }
}, { _id: false });

// TodoList Schema
const todolistSchema = new mongoose.Schema(
    {
        task: [taskSchema], // array of task objects
        email: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        timestamps: true,
    }
);
// Counter for per-user taskId
const counterSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 },
    taskSeq: { type: Number, default: 0 } // for taskId inside task array
});

const TodoList = mongoose.model("TodoList", todolistSchema);
const Counter = mongoose.model("Counter", counterSchema);

module.exports = {
    TodoList,
    Counter,
    category,
    priority
};

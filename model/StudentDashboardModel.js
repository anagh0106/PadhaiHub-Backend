const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

// Task Subdocument Schema
const taskSchema = new mongoose.Schema({
    taskId: {
        type: Number,
        required: true,
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

// Auto-increment doc ID (optional)
// todolistSchema.plugin(AutoIncrement, { inc_field: "taskid" });

// Counter for per-user taskId
const counterSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 },
    taskSeq: { type: Number, default: 0 }, // for taskId inside task array
});

const TodoList = mongoose.model("TodoList", todolistSchema);
const Counter = mongoose.model("Counter", counterSchema);

module.exports = {
    TodoList,
    Counter,
};

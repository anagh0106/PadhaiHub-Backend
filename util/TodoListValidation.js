const zod = require("zod");

const AddTaskValidation = zod.object({
    text: zod.string().min(1, "Task is required.")
});


const EditTaskValidation = zod.object({
    text: zod.string().min(1, "Task is required."),
    taskId: zod.number(),
});

module.exports = { AddTaskValidation, EditTaskValidation };

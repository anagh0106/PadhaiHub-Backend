const { TodoList, Counter } = require("../model/StudentDashboardModel");
const Signupmodel = require("../model/SignupModel");

// ADD TASK
const addTask = async (req, res) => {
    const { text } = req.body;
    const email = req.user?.email;

    if (!email) return res.status(401).json({ message: "Unauthorized. Email not found in token." });
    if (!text) return res.status(400).json({ message: "Please enter task text." });

    try {
        const isUser = await Signupmodel.findOne({ email });
        if (!isUser) return res.status(404).json({ message: "User not found." });

        const counter = await Counter.findOneAndUpdate(
            { email },
            { $inc: { taskSeq: 1 } },
            { new: true, upsert: true }
        );

        const taskId = counter.taskSeq;


        const newTask = { text, completed: false, taskId };

        let existing = await TodoList.findOne({ email });

        if (existing) {
            existing.task.push(newTask);
            await existing.save();
            return res.status(200).json({ message: "Task added!", task: newTask });
        } else {
            const created = await TodoList.create({
                task: [newTask],
                email
            });
            return res.status(201).json({ message: "Task list created!", task: created });
        }

    } catch (error) {
        console.error("Add Task Error:", error);
        return res.status(500).json({ message: "Something went wrong." });
    }
};
// EDIT TASK
const editTask = async (req, res) => {
    const { taskId, text } = req.body;
    const email = req.user?.email;

    if (!email) return res.status(401).json({ message: "Unauthorized." });
    if (!taskId || !text) return res.status(400).json({ message: "Task ID and text are required." });

    try {
        const todoList = await TodoList.findOne({ email });
        if (!todoList) return res.status(404).json({ message: "No tasks found." });

        const taskToUpdate = todoList.task.find((t) => t.taskId === parseInt(taskId));
        if (!taskToUpdate) return res.status(404).json({ message: "Task not found." });

        taskToUpdate.text = text;

        await todoList.save();

        return res.status(200).json({ message: "Task updated!", task: taskToUpdate });

    } catch (err) {
        console.error("Edit Task Error:", err);
        return res.status(500).json({ message: "Error updating task." });
    }
};
// GET TASKS
const getTask = async (req, res) => {
    const email = req.user?.email;

    if (!email) return res.status(401).json({ message: "Unauthorized." });

    try {
        const todoList = await TodoList.findOne({ email });
        if (!todoList || todoList.task.length === 0) {
            return res.status(404).json({ message: "No tasks found." });
        }

        return res.status(200).json({
            message: "Tasks fetched!",
            tasks: todoList.task
        });

    } catch (err) {
        console.error("Get Task Error:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};
// DELETE TASK
const deleteTask = async (req, res) => {
    const email = req.user?.email;
    const taskId = Number(req.params.taskId);
    console.log(req.params);


    if (!email) return res.status(401).json({ message: "Unauthorized." });
    if (!taskId) return res.status(400).json({ message: "Task ID required." });

    try {
        const todoList = await TodoList.findOne({ email });
        if (!todoList) return res.status(404).json({ message: "Task list not found." });

        const initialLength = todoList.task.length;
        todoList.task = todoList.task.filter((t) => t.taskId !== taskId);

        if (todoList.task.length === initialLength) {
            return res.status(404).json({ message: "Task not found." });
        }

        await todoList.save();

        return res.status(200).json({ message: "Task deleted!" });

    } catch (err) {
        console.error("Delete Task Error:", err);
        return res.status(500).json({ message: "Error deleting task." });
    }
};

module.exports = {
    addTask,
    editTask,
    getTask,
    deleteTask
};

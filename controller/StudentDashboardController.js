const { TodoList, Counter, category, priority } = require("../model/StudentDashboardModel");
const Signupmodel = require("../model/SignupModel");

// ADD TASK
// const addTask = async (req, res) => {
//     const { text } = req.body;
//     const email = req.user?.email;

//     if (!email) return res.status(401).json({ message: "Unauthorized. Email not found in token." });
//     if (!text) return res.status(400).json({ message: "Please enter task text." });

//     try {
//         const isUser = await Signupmodel.findOne({ email });
//         if (!isUser) return res.status(404).json({ message: "User not found." });

//         const counter = await Counter.findOneAndUpdate(
//             { email },
//             { $inc: { taskSeq: 1 } },
//             { new: true, upsert: true }
//         );

//         const taskId = counter.taskSeq;


//         const newTask = { text, completed: false, taskId };

//         let existing = await TodoList.findOne({ email });

//         if (existing) {
//             existing.task.push(newTask);
//             await existing.save();
//             return res.status(200).json({ message: "Task added!", task: newTask });
//         } else {
//             const created = await TodoList.create({
//                 task: [newTask],
//                 email
//             });
//             return res.status(201).json({ message: "Task list created!", task: created });
//         }

//     } catch (error) {
//         console.error("Add Task Error:", error);
//         return res.status(500).json({ message: "Something went wrong." });
//     }
// };
// const addTask = async (req, res) => {
//     const { text } = req.body;
//     const email = req.user?.email;

//     // Validation
//     if (!email) return res.status(401).json({ message: "Unauthorized. Email not found in token." });
//     if (!text?.trim()) return res.status(400).json({ message: "Please enter task text." });

//     try {
//         // Check if user exists
//         const isUser = await Signupmodel.findOne({ email });
//         if (!isUser) return res.status(404).json({ message: "User not found." });

//         // Get or create counter and increment taskId
//         const counter = await Counter.findOneAndUpdate(
//             { email },
//             { $inc: { taskSeq: 1 } },
//             { new: true, upsert: true }
//         );

//         const taskId = counter.taskSeq;

//         const newTask = { text: text.trim(), completed: false, taskId };

//         // Add to existing list or create new
//         const updatedList = await TodoList.findOneAndUpdate(
//             { email },
//             { $push: { task: newTask } },
//             { new: true, upsert: true }
//         );

//         return res.status(200).json({
//             message: "Task added successfully!",
//             task: newTask,
//             taskCount: updatedList.task.length
//         });

//     } catch (error) {
//         console.error("Add Task Error:", error);
//         return res.status(500).json({ message: "Internal server error. Please try again." });
//     }
// };
const addTask = async (req, res) => {
    const {
        text,
        description,
        category,
        priority,
        duedate,
        time,
    } = req.body;

    const email = req.user?.email;

    // Validation
    if (!email) return res.status(401).json({ message: "Unauthorized. Email not found in token." });

    if (!text?.trim()) return res.status(400).json({ message: "Please enter task title." });
    if (!description?.trim()) return res.status(400).json({ message: "Please enter task description." });
    if (!category) return res.status(400).json({ message: "Category is required." });
    if (!priority) return res.status(400).json({ message: "Priority is required." });
    if (!duedate) return res.status(400).json({ message: "Due date is required." });
    if (!time) return res.status(400).json({ message: "Duration is required." });

    try {
        // Check if user exists
        const isUser = await Signupmodel.findOne({ email });
        if (!isUser) return res.status(404).json({ message: "User not found." });

        // Get or create counter and increment taskId
        const counter = await Counter.findOneAndUpdate(
            { email },
            { $inc: { taskSeq: 1 } },
            { new: true, upsert: true }
        );

        const taskId = counter.taskSeq;

        const newTask = {
            taskId,
            text: text.trim(),
            description: description.trim(),
            category,
            priority,
            duedate,
            time,
            completed: false
        };

        // Add to existing list or create new
        const updatedList = await TodoList.findOneAndUpdate(
            { email },
            { $push: { task: newTask } },
            { new: true, upsert: true }
        );

        return res.status(200).json({
            message: "Task added successfully!",
            task: newTask,
            taskCount: updatedList.task.length
        });

    } catch (error) {
        console.error("Add Task Error:", error);
        return res.status(500).json({ message: "Internal server error. Please try again." });
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
            data: todoList,
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
const getCategory = async (req, res) => {
    try {
        console.log(category);
        return res.status(200).json(category)

    } catch (error) {
        return res.status(500).json({ message: "Error While Getting Category " });
    }
}
const getPriority = async (req, res) => {
    try {
        console.log(priority);
        return res.status(200).json(priority)

    } catch (error) {
        return res.status(500).json({ message: "Error While Getting priority " });
    }
}


module.exports = {
    addTask,
    editTask,
    getTask,
    deleteTask,
    getCategory,
    getPriority
};

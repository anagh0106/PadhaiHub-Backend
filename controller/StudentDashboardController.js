const { TodoList, Counter, category, priority } = require("../model/StudentDashboardModel");
const Signupmodel = require("../model/SignupModel");
const { tasks } = require("googleapis/build/src/apis/tasks");

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
            data: todoList.task,
        });

    } catch (err) {
        console.error("Get Task Error:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};
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
const getTaskStatus = async (req, res) => {
    try {
        const email = req.user?.email
        const Tasks = (await TodoList.find({ email: email })).map(t => t.task)
        const CompletedTask = Tasks[0].filter(t => t.completed)
        const PendingTask = Tasks[0].filter(t => !t.completed)
        const PendingTaskCount = PendingTask.length
        const CompletedTaskCount = CompletedTask.length

        return res.status(200).json({
            PendingTask: PendingTask,
            CompletedTask: CompletedTask,
            PendingTaskCount: PendingTaskCount,
            CompletedTaskCount: CompletedTaskCount,
            labels: {
                PendingTasks: "Pending Task",
                CompletedTasks: "Completed Task"
            }
        })

    } catch (error) {
        return res.status(500).json({ message: "Error While Getting Pending task " });
    }
}
const markAsCompleted = async (req, res) => {
    try {
        const { taskId } = req.body;
        const email = req.user?.email;
        // Step 1: Find the document for that email
        const todoDoc = await TodoList.findOne({ email });
        if (!todoDoc) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Step 2: Find the task inside the array
        const taskIndex = todoDoc.task.findIndex(t => t.taskId == taskId);
        if (taskIndex === -1) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        // Step 3: Toggle the completed field
        todoDoc.task[taskIndex].completed = !todoDoc.task[taskIndex].completed;

        // Step 4: Save the document
        await todoDoc.save();

        // Step 5: Send response
        return res.json({
            success: true,
            updatedTask: todoDoc.task[taskIndex]
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error while marking task completed"
        });
    }
};


module.exports = {
    addTask,
    editTask,
    getTask,
    deleteTask,
    getCategory,
    getPriority,
    getTaskStatus,
    markAsCompleted
};

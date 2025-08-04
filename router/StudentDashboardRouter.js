const StuDashController = require("../controller/StudentDashboardController");
const express = require("express");
const router = express.Router();
const TodolistValidation = require("../util/TodoListValidation");
const validate = require("../middleware/zodMiddleware");
const middleware = require("../middleware/AuthMiddleware");

router.post(
    "/AddTask",
    validate.UserValidation1(TodolistValidation.AddTaskValidation),
    middleware,
    StuDashController.addTask
);

router.put(
    "/EditTask",
    validate.UserValidation1(TodolistValidation.EditTaskValidation),
    middleware,
    StuDashController.editTask
);

router.get("/GetTask",
    middleware,
    StuDashController.getTask
)
router.delete("/DeleteTask/:taskId", middleware, StuDashController.deleteTask);

router.get("/getCategory", StuDashController.getCategory)
router.get("/getPriority", StuDashController.getPriority)
router.get("/getPendingTask", StuDashController.getPendingTask)
router.post("/markAsCompleted", StuDashController.markAsCompleted)
module.exports = router;

const mocktestController = require("../controller/MockTestSubmissionController")
const middleware = require("../middleware/AuthMiddleware")
const role = require("../middleware/RoleMiddleware")
const express = require("express")
const router = express.Router()

router.post("/mockTest/saveTest", middleware, role("user"), mocktestController.submitTest)
router.get("/mockTest/completedTest", middleware, role("user"), mocktestController.getAllCompletedTests)
router.post("/mockTest/calculateScore", middleware, mocktestController.calculateScore)
router.get("/mockTest/getPastorTodayTestsScore", mocktestController.getPastorTodayTestsScore)

module.exports = router
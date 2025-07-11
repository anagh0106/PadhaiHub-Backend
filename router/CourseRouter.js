const courseController = require("../controller/CourseSubjectController")
const express = require("express")
const router = express.Router()
const middleware = require("../middleware/AuthMiddleware")
const { UserValidation1 } = require("../middleware/zodMiddleware")
const counterValidation = require("../util/CounterValidation")

router.post("/addSubject", courseController.addSubjects)
router.get("/getSubject", courseController.getSubjects)
router.delete("/delSubject", courseController.deleteSubjects)

router.post("/postCount", middleware, courseController.courseSubscriptionCounter)

module.exports = router
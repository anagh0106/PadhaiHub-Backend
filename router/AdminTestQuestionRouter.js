const QuestionController = require("../controller/AdminTestQuestionController")
const middleware = require("../middleware/AuthMiddleware")
const role = require("../middleware/RoleMiddleware")
const express = require("express")
const router = express.Router()

router.get("/admin/mockQuestion/getOptions", QuestionController.getOptions)
router.post("/admin/mockQuestion/createQuestions", QuestionController.createQuestions)
router.get("/admin/mockQuestion/getTestQuestions/:testId", QuestionController.getTestQuestions);
router.get("/admin/mockQuestion/getAllTestIds", QuestionController.getAllTestIds);

router.get("/mockQuestion/getStudentTestQuestion/:testId",
    middleware,
    role("user"),
    QuestionController.getTestQuestionsForStudents)

router.get("/mockQuestion/getTotalQuestionCountById/:id", middleware, QuestionController.getTotalQuestionCountById)
module.exports = router
const mockTestController = require("../controller/AdminMockTestController")
const middleware = require("../middleware/AuthMiddleware")
const role = require("../middleware/RoleMiddleware")
const express = require("express")
const router = express.Router()

router.post("/admin/creatMockTest", middleware, role("admin"), mockTestController.createMockTest)
router.get("/admin/getStandard", mockTestController.getstandards)
router.get("/admin/getSubjects", mockTestController.getSubjects)
router.get("/admin/getGroup", mockTestController.getGroup)
router.get("/admin/getMockTest", middleware, mockTestController.getMockTest)
router.delete("/admin/deleteMockTest/:id", middleware, role("admin"), mockTestController.deleteMockTest)

router.get("/student/getTest", middleware, mockTestController.getMockTest)
module.exports = router
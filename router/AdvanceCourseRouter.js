const AdvanceCourseController = require("../controller/AdvanceCourseController")
const roleRequire = require("../middleware/RoleMiddleware")
const authMiddleware = require("../middleware/AuthMiddleware")
const express = require("express")
const router = express.Router()

router.post(
    "/addAdvanceCourse"
    , authMiddleware,
    roleRequire("admin"),
    AdvanceCourseController.addAdvanceCourse
)

router.put(
    "/editAdvanceCourse"
    , authMiddleware,
    roleRequire("admin"),
    AdvanceCourseController.editAdvanceCourse
)
router.get(
    "/getAllAdvanceCourse"
    , authMiddleware,
    // roleRequire("admin"),
    AdvanceCourseController.getAllAdvanceCourse
)

module.exports = router
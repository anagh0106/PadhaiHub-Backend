const Facultycontroller = require("../controller/FacultyController")
const middleware = require("../middleware/AuthMiddleware")
const requiRole = require("../middleware/RoleMiddleware")
const express = require("express")
const router = express.Router()

router.post("/addFaculty", middleware, requiRole("admin"), Facultycontroller.addFaculty)
router.get("/getFaculties", Facultycontroller.getAllFaculty)
router.get("/getFacultyCount", middleware, Facultycontroller.Facultycount)

module.exports = router 
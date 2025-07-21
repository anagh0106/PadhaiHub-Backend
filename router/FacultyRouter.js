const Facultycontroller = require("../controller/FacultyController")
const FacultyLogincontroller = require("../controller/FacultyLoginController")
const middleware = require("../middleware/AuthMiddleware")
const requiRole = require("../middleware/RoleMiddleware")
const express = require("express")
const router = express.Router()

router.post("/addFaculty", middleware, requiRole("admin"), Facultycontroller.addFaculty)
router.get("/getFaculties", Facultycontroller.getAllFaculty)
router.get("/getFacultyCount", middleware, Facultycontroller.Facultycount)
router.get("/getFacultyInfoByEmail", Facultycontroller.getFacultyByEmail)
router.post("/login", FacultyLogincontroller.handleLoginFaculty)
router.get("/getFacultySubjects", Facultycontroller.FacultySubject)
router.get("/getFacultyExperience", Facultycontroller.FacultyExperience)
router.get("/getFacultyDegree", Facultycontroller.FacultyDegree)

module.exports = router 
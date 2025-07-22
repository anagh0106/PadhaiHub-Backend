const express = require("express")
const router = express.Router()
const homaPageController = require("../controller/HomePageController")
router.get("/getText", homaPageController.homePageText1)
router.get("/getStudentCount", homaPageController.StudentCount)
router.get("/getFacultyCount", homaPageController.Facultycount)

module.exports = router
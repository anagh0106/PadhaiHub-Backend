const loginController = require("../controller/FacultyLoginController")

const express = require("express")
const router = express.Router()

router.post("/loginFaculty", loginController.handleLoginFaculty)

module.exports = router
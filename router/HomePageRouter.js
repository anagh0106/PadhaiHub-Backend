const express = require("express")
const router = express.Router()
const homaPageController = require("../controller/HomePageController")
router.get("/getText", homaPageController.homePageText1)

module.exports = router
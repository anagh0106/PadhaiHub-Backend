const cardController = require("../controller/CardController")
const express = require("express")
const router = express.Router()

router.post("/addCard", cardController.addCard)
router.get("/getAllCards", cardController.getAllCard)

module.exports = router
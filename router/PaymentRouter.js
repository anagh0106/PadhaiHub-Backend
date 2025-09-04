const express = require("express")
const router = express.Router()
const controller = require("../controller/PaymentController")
const middleware = require("../middleware/AuthMiddleware")
router.get('/sendReq', middleware, controller.sendRequest)

module.exports = router
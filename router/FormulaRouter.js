const FormulaController = require("../controller/FormulaController")
const authMiddleware = require("../middleware/AuthMiddleware")
const role = require("../middleware/RoleMiddleware")
const express = require("express")
const router = express.Router()


router.post(
    "/addFormula",
    authMiddleware,
    role("admin"),
    FormulaController.AddFormulas
)

router.get(
    "/GetAllFormula",
    authMiddleware,
    FormulaController.GetAllFormulas
)

module.exports = router
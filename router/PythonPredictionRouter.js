const express = require('express');
const router = express.Router();
const { savePrediction, getAllPredictions } = require('../controller/PythonPredictionController');
const authMiddleware=require("../middleware/AuthMiddleware")

router.post('/save',authMiddleware, savePrediction);
router.get('/history',authMiddleware, getAllPredictions);

module.exports = router;

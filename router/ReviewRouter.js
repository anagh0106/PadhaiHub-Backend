const reviewController = require("../controller/ReviewController");
const express = require("express");
const router = express.Router();

router.post("/submitReview", reviewController.submitReview);
router.get("/getReviews", reviewController.getReviews);


module.exports = router;
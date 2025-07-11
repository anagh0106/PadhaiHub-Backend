const reviewModel = require('../model/ReviewModel');
const signupModel = require('../model/SignupModel');

const submitReview = async (req, res) => {

    const { name, message, grade } = req.body;
    if (!name || !message || !grade) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const review = await reviewModel.create({ name, message, grade });
        return res.status(201).
            json({ message: "Review submitted successfully", review });
    } catch (error) {
        console.log(error);
        return res.status(500).
            json({ message: "Internal server error", error });

    }
}
const getReviews = async (req, res) => {
    try {
        const reviews = await reviewModel.find().sort({ createdAt: -1 }).limit(10);
        return res.status(200).json(reviews);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

module.exports = {
    submitReview,
    getReviews

}
const { TestQuestionModel } = require("../model/AdminTestQuestionsModel")
const testModel = require("../model/AdminMockTestModel")
const { Options } = require("../model/AdminTestQuestionsModel")


const createQuestions = async (req, res) => {
    try {
        const { testId, questions } = req.body;

        if (!testId || !questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                message: "All fields are required!",
            });
        }

        const createdQuestions = await Promise.all(
            questions.map(async (q) => {
                console.log("📦 Data received:", q);
                const test = await TestQuestionModel.create({
                    testId,
                    questions: q.question,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                });
                return test;
            })
        );

        return res.status(201).json({
            message: "Questions created successfully",
            questions: createdQuestions,
        });
    } catch (error) {
        console.error("Error creating question:", error);
        return res.status(500).json({
            message: "Internal Server Error!",
            error: error.message,
        });
    }
};
const getTestQuestions = async (req, res) => {
    try {
        const { testId } = req.params;

        const questions = await TestQuestionModel.find({ testId });

        if (!questions || questions.length === 0) {
            return res.status(404).json({
                message: "❌ No questions found for this testId",
            });
        }

        return res.status(200).json({ questions });
    } catch (error) {
        console.error("❌ Error in getTestQuestions:", error);
        return res.status(500).json({
            message: "Internal Server Error!",
            error: error.message,
        });
    }
};
const getTestQuestionsForStudents = async (req, res) => {
    try {
        const { testId } = req.params;
        const email = req.user?.email
        if (!email) {
            return res.status(404).json({
                message: "You'r not permitted !"
            })
        }

        const questions = await TestQuestionModel.find({ testId });

        if (!questions || questions.length === 0) {
            return res.status(404).json({
                message: "❌ No questions found for this testId",
            });
        }

        return res.status(200).json({ questions });
    } catch (error) {
        console.error("❌ Error in getTestQuestions:", error);
        return res.status(500).json({
            message: "Internal Server Error!",
            error: error.message,
        });
    }
};
const getAllTestIds = async (req, res) => {
    try {
        const testIds = await TestQuestionModel.distinct("testId");
        return res.status(200).json({
            message: "✅ All unique testIds fetched successfully",
            testIds,
        });
    } catch (error) {
        console.error("❌ Error fetching testIds:", error);
        return res.status(500).json({
            message: "Internal Server Error!",
            error: error.message,
        });
    }
};
const getOptions = async (req, res) => {
    try {
        return res.status(201).json({ Options })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error !"
        })
    }
}
const getTotalQuestionCountById = async (req, res) => {
    try {
        const email = req.user?.email
        if (!email) return res.status(404).json({
            message: "You are not permitted !"
        })
        const { id } = req.params;
        const questionCount = await TestQuestionModel.find({ testId: id })
        const count = questionCount.length
        res.status(201).json({ count })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error !"
        })
    }
}

module.exports = {
    getOptions,
    createQuestions,
    getTestQuestions,
    getAllTestIds,
    getTestQuestionsForStudents,
    getTotalQuestionCountById
}
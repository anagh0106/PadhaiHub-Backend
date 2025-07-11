const { MockTestModel, standards, subjects, groups } = require('../model/AdminMockTestModel');
const { TestQuestionModel } = require("../model/AdminTestQuestionsModel")

const createMockTest = async (req, res) => {
    try {

        const email = req.user?.email
        if (!email) {
            return res.status(404).json({
                message: "You are not permitted !"
            })
        }

        const {
            title,
            standard,
            subject,
            group,
            chapter,
            date,
            totalQuestion,
            marksPerQuestion,
            startTime,
            duration,
            negativeMarks
        } = req.body;

        if (
            !title || !standard || !subject || !group ||
            !chapter || !date || !startTime || !duration ||
            !totalQuestion || !marksPerQuestion || !negativeMarks
        ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newTest = new MockTestModel({
            title,
            standard,
            subject,
            group,
            chapter,
            date,
            startTime,
            duration,
            totalQuestion,
            marksPerQuestion,
            negativeMarks,
        });

        await newTest.save();

        res.status(201).json({
            message: "Mock test created successfully!",
            mockTest: newTest
        });

    } catch (error) {
        console.error("Error in createMockTest:", error);
        res.status(500).json({
            message: "Something went wrong while creating the test",
            error: error.message
        });
    }
};
const getMockTest = async (req, res) => {
    try {
        const email = req.user?.email

        if (!email) return null
        const { grade, group } = req.query;

        const filters = {};
        if (grade) filters.standard = grade;
        if (group) filters.group = group;

        const mocktest = await MockTestModel.find(filters);
        const mockTestDate = mocktest.map(t => t.date.toISOString().split("T")[0])
        console.log(mockTestDate)

        return res.json({ mocktest });

    } catch (error) {
        console.error("Error in GetMockTest:", error);
        res.status(500).json({
            message: "Something went wrong while fetching the tests",
            error: error.message
        });
    }
};
const deleteMockTest = async (req, res) => {
    try {
        const { id } = req.params;
        const email = req.user?.email

        if (!email) return res.status(404).json({ message: "Only Admin Can Delete It" })

        // Delete the mock test
        const deletedMockTest = await MockTestModel.findByIdAndDelete(id);

        if (!deletedMockTest) {
            return res.status(404).json({
                message: "Mock test not found",
            });
        }

        // Delete all questions related to that mock test
        const deletedQuestions = await TestQuestionModel.deleteMany({ testId: id });

        res.status(200).json({
            message: "Mock Test and its related questions deleted successfully",
            deletedMockTest,
            deletedQuestionsCount: deletedQuestions.deletedCount,
        });

    } catch (error) {
        console.error("❌ Error in deleting mock test and questions:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

const getstandards = async (req, res) => {
    try {
        return res.json(standards)

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error !!"
        })
    }
}
const getSubjects = async (req, res) => {
    try {
        return res.status(201).json(subjects)
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error !!"
        })
    }
}
const getGroup = async (req, res) => {
    try {
        return res.status(201).json(groups)
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error !!"
        })
    }
}
module.exports = {
    createMockTest,
    getstandards,
    getSubjects,
    getGroup,
    getMockTest,
    deleteMockTest
};

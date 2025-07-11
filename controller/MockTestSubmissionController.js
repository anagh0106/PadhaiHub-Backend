const { SubmissionModel } = require("../model/MockTestSubmissionModel");
const { options } = require("../model/MockTestSubmissionModel");
const { TestQuestionModel } = require("../model/AdminTestQuestionsModel")
const { MockTestModel } = require("../model/AdminMockTestModel")
const studentInfoModel = require("../model/StudentInfoModel")
const mongoose = require("mongoose");
const _ = require("mongoose-sequence");

const submitTest = async (req, res) => {
    try {
        const email = req.user?.email;

        const { testId, answers: answersObj } = req.body;

        if (!testId || !answersObj || typeof answersObj !== "object") {
            return res.status(400).json({ message: "testId and answers are required" });
        }

        const answers = Object.entries(answersObj)
            .filter(([_, selectedOption]) => selectedOption?.trim()) // skip empty
            .map(([questionId, selectedOption]) => ({
                questionId: new mongoose.Types.ObjectId(questionId),
                selectedOption: selectedOption.trim()
            }));

        const alreadySubmitted = await SubmissionModel.findOne({ email, testId, isSubmitted: true });
        if (alreadySubmitted) {
            return res.status(409).json({ message: "Test already submitted" });
        }

        for (const ans of answers) {
            const exists = await TestQuestionModel.exists({ _id: ans.questionId });
            if (!exists) {
                return res.status(400).json({ message: "Invalid questionId: " + ans.questionId });
            }
        }


        const submission = await SubmissionModel.create({
            email,
            testId,
            answers,
            isSubmitted: true
        });

        return res.status(201).json({
            message: "Test submitted successfully",
            submission,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};
const getAllCompletedTests = async (req, res) => {
    try {
        const email = req.user.email;

        const submissions = await SubmissionModel.find({ email, isSubmitted: true }).populate('testId');

        if (!submissions) {
            return res.status(404).json({
                message: "Submission not found for this email !"
            })
        }
        return res.status(200).json({ submittedTests: submissions });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
const calculateScore = async (req, res) => {
    try {
        const { submissionId } = req.body;
        const email = req.user?.email;

        if (!mongoose.Types.ObjectId.isValid(submissionId)) {
            return res.status(400).json({ message: "Invalid testId" });
        }

        const submission = await SubmissionModel.findOne({
            email,
            _id: submissionId
        }).populate("testId");
        console.log(submission);

        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        const { answers } = submission;
        const testMeta = submission.testId;
        const { marksPerQuestion = submission.testId.marksPerQuestion, negativeMarks = submission.testId.negativeMarks } = testMeta;

        const questionIds = answers.map(ans => ans.questionId);

        const questionDocs = await TestQuestionModel.find({
            _id: { $in: questionIds },
        });

        let score = 0;

        questionDocs.forEach((question) => {
            const submitted = answers.find(
                (a) => a.questionId.toString() === question._id.toString()
            );

            if (submitted) {
                if (submitted.selectedOption === question.correctAnswer) {
                    score += marksPerQuestion;
                } else {
                    score -= negativeMarks;
                }
            }
        });

        // Update the score in DB
        submission.score = score;
        submission.isSubmitted = true;
        await submission.save();

        return res.json({
            score,
            testDetails: {
                title: testMeta.title,
                subject: testMeta.subject,
                totalMarks: testMeta.totalMarks,
            },
            submission
        });

    } catch (error) {
        console.error("Score calculation error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const getPastorTodayTestsScore = async (req, res) => {
    try {

        // record of students who submitted Test
        const submittedStudent = await SubmissionModel.find()

        // date of current day
        const today = new Date().toISOString().split("T")[0]

        // All Tests Data
        const TestsData = await MockTestModel.find()


        // Filtered dates with today 
        const pastOrTodayTests = TestsData.filter(test => {
            const testDate = new Date(test.date).toISOString().split("T")[0];
            return testDate < today;
        });

        const allstudents = submittedStudent.filter(s => s.isSubmitted == true)

        const studentInfo = await studentInfoModel.find()
        return res.status(201).json({
            testCompletedStudents: allstudents,
            TestData: TestsData,
            date: pastOrTodayTests,
            students: studentInfo
        })

    } catch (error) {
        console.error("Error in getPastorTodayTestsScore:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    submitTest,
    calculateScore,
    getAllCompletedTests,
    getPastorTodayTestsScore
};

const signupModel = require("../model/SignupModel")
const { FacultyModel } = require("../model/FacultyModel")

const homePageText1 = async (req, res) => {
    try {
        const mainText = "Best Tuition Classes in the City";
        const headingLine1 = "Excel in Your";
        const headingLine2 = "Academic Journey";
        const description = "Join thousands of successful students at PadhaiHub. Expert teachers, personalized attention, and proven results for Classes 11 & 12.";

        return res.status(200).json({
            mainText,
            headingLine1,
            headingLine2,
            description
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error !"
        });
    }
};
const StudentCount = async (req, res) => {
    try {
        const count = await signupModel.countDocuments({ role: "user" })

        return res.status(200).json(count)
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error !"
        });
    }
}
const Facultycount = async (req, res) => {
    try {
        const count = await FacultyModel.countDocuments()
        res.json(count)
    } catch (error) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
}
module.exports = {
    homePageText1,
    StudentCount,
    Facultycount
};

const StudentInfoModel = require("../model/StudentInfoModel");

const saveStudentInfo = async (req, res) => {
    try {
        const { studentId, email, fullName, phone, address, grade, group } = req.body;

        
        if (!studentId || !email || !fullName || !phone || !address || !grade || !group) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const existing = await StudentInfoModel.findOne({ studentId });
        if (existing) {
            return res.status(200).json({
                message: "Already submitted",
                alreadySubmitted: true
            });
        }

        const student = new StudentInfoModel({
            studentId: studentId.trim(),
            email: email.trim(),
            fullName: fullName.trim(),
            phone: phone.trim(),
            address: address.trim(),
            grade: grade.trim(),
            group: group.trim(),
            profile: req.file ? `uploads/${req.file.filename}` : null
        });


        await student.save();

        return res.status(201).json({ message: "Student info saved successfully." });
    } catch (err) {
        console.error("Error saving student info:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
const updateStudentInfo = async (req, res) => {
    const { studentId, email, fullName, phone, address } = req.body;

    if (!studentId || !email || !fullName || !phone || !address) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {

        const student = await StudentInfoModel.findOneAndUpdate(
            { studentId },
            { email, fullName, phone, address },
            { new: true }
        );
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        return res.status(200).json({ message: "Student info updated successfully.", student });
    } catch (err) {
        console.error("Error updating student info:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const checkStudentIdExists = async (req, res) => {
    try {
        const { studentId } = req.query;
        // console.log("Received query studentId:", studentId);

        if (!studentId) {
            return res.status(400).json({ message: "Student ID is required." });
        }

        const existing = await StudentInfoModel.findOne({ studentId });
        // console.log("MongoDB check result:", existing);

        // res.json({ exists: !!existing });
    } catch (err) {
        console.error("Error fetching student info:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
const getStudentInfo = async (req, res) => {
    try {
        const email = "anagh1516@gmail.com";
        // console.log(email);

        const userInformation = await StudentInfoModel.findOne({ email });
        console.log(userInformation)
        if (!userInformation) {
            return res.status(404).json({
                message: "User information not found!",
            });
        }
        return res.status(200).json(userInformation);
    } catch (error) {
        console.error("Error fetching student info:", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    saveStudentInfo,
    updateStudentInfo,
    checkStudentIdExists,
    getStudentInfo
};

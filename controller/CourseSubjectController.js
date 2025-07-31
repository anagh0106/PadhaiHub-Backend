const { CourseSubscriptionModel } = require("../model/CourseModel");
const { CourseModel } = require("../model/CourseModel");

const addSubjects = async (req, res) => {
    try {
        const { subjectName } = req.body;

        if (!subjectName) {
            return res.status(400).json({
                message: "Subject name is required!"
            });
        }

        await CourseModel.create({
            subjectName: subjectName
        });

        return res.status(201).json({
            message: "Subject added successfully!"
        });

    } catch (error) {
        console.error("Error while adding subject:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
const getSubjects = async (req, res) => {
    try {
        const subjects = await CourseModel.find();

        if (subjects.length > 0) {
            return res.status(200).json({
                message: "Your Subjects are following !!",
                subjects
            });
        } else {
            return res.status(404).json({
                message: "No Subjects Exist!"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error!",
            error: error.message
        });
    }
}
const deleteSubjects = async (req, res) => {
    const { subjectName } = req.body;

    try {
        const OriginalSubject = await CourseModel.findOne({ subjectName: subjectName });

        if (!OriginalSubject) {
            return res.status(404).json({
                message: "Subject not found!"
            });
        }

        const deletedSubject = await CourseModel.deleteOne({ subjectName: subjectName });

        return res.status(202).json({
            message: `${subjectName} is deleted successfully.`,
            deletedCount: deletedSubject.deletedCount
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error!",
            error: error.message
        });
    }
}
const courseSubscriptionCounter = async (req, res) => {

    try {
        const email = req.user?.email;

        if (!email) {
            return res.status(404).json({
                message: "Email not found in token!"
            });
        }
        // 🔍 Check if already exists
        const existing = await CourseSubscriptionModel.findOne({ email });
        console.log(existing)

        if (existing) {
            return res.status(409).json({
                message: "Subscription already exists for this email"
            });
        }

        // ✅ Create new subscription
        const Subscription = await CourseSubscriptionModel.create({
            email,
            isActivated: true
        });

        return res.status(201).json({
            message: "Subcription Added Successfully!",
            subscription: Subscription
        });

    } catch (err) {
        console.log("DB Error => ", err);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};
const getSubcriptedUser = async (req, res) => {
    try {
        const email = req.user?.email;
        console.log(email);

        if (!email) {
            return res.status(404).json({
                message: "Email not found in token!"
            });
        }
        const stu = await CourseSubscriptionModel.findOne({ email })
        return res.status(200).json({
            student: stu
        })
    } catch (err) {
        console.log("DB Error => ", err);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
}

module.exports = {
    addSubjects,
    getSubjects,
    deleteSubjects,
    courseSubscriptionCounter,
    getSubcriptedUser
}

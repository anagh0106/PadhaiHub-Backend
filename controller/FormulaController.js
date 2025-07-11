const FormulaModel = require("../model/FormulaModel");
const StudentInfoModel = require("../model/StudentInfoModel")

const AddFormulas = async (req, res) => {
    try {
        const { title, formula, subject } = req.body;

        // Basic validation
        if (!title || !formula || !subject) {
            return res.status(400).json({
                message: "All fields are required!",
            });
        }

        // Check for duplicate formula
        const existingFormula = await FormulaModel.findOne({ formula });
        if (existingFormula) {
            return res.status(409).json({
                message: "Formula already exists!",
            });
        }

        // Save new formula
        const newFormula = await FormulaModel.create({ title, formula, subject });

        return res.status(201).json({
            message: "Formula added successfully!",
            data: newFormula,
        });

    } catch (error) {
        console.error("Error adding formula:", error);
        return res.status(500).json({
            message: "Internal server error!",
            error: error.message,
        });
    }
};
// const GetAllFormulas = async (req, res) => {
//     try {
//         const email = req.user?.email; // 🔐 token se user.id aa raha hai
//         // console.log(email);
//         const student = await StudentInfoModel.findOne({ email: email });

//         if (!student) return res.status(404).json({ message: "Student not found" });

//         const group = student.group;
//         const grade = student.grade;
//         // console.log(group, grade);


//         // 🎯 Filter subjects based on group
//         let subjectFilter;
//         if (group === "A") {
//             subjectFilter = ["Maths", "Physics", "Chemistry"];
//         } else {
//             subjectFilter = ["Biology", "Physics", "Chemistry"];
//         }
//         console.log(subjectFilter);


//         const formulas = await FormulaModel.find({
//             subject: { $in: subjectFilter },
//         }).limit(10);

//         res.status(200).json({
//             message: "Formulas fetched successfully",
//             data: formulas
//         });

//     } catch (err) {
//         console.error("Formula fetch error:", err);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };
const GetAllFormulas = async (req, res) => {
    try {
        const email = req.user?.email;
        const student = await StudentInfoModel.findOne({ email: email });

        if (!student) return res.status(404).json({ message: "Student not found" });

        const group = student.group;

        // 🎯 Filter subjects based on group
        let subjectFilter;
        if (group === "A") {
            subjectFilter = ["Maths", "Physics", "Chemistry"];
        } else {
            subjectFilter = ["Biology", "Physics", "Chemistry"];
        }

        // 🎲 Randomly sample 10 formulas matching the subject filter
        const formulas = await FormulaModel.aggregate([
            { $match: { subject: { $in: subjectFilter } } },
            { $sample: { size: 25 } }
        ]);

        res.status(200).json({
            message: "Random formulas fetched successfully",
            data: formulas
        });

    } catch (err) {
        console.error("Formula fetch error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { AddFormulas, GetAllFormulas };

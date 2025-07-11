const AdvanceCourseModel = require("../model/AdvanceCourseModel");

const addAdvanceCourse = async (req, res) => {
    try {
        const { coursename, courseid, description, price } = req.body;

        if (!coursename || !courseid || !description || !price) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const existing = await AdvanceCourseModel.findOne({ courseid });
        if (existing) {
            return res.status(409).json({ message: "Course ID already exists." });
        }

        const course = await AdvanceCourseModel.create({
            coursename,
            courseid,
            description,
            price
        });

        return res.status(201).json({
            message: "Course added successfully.",
            course
        });
    } catch (error) {
        console.error("Error while adding course:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
const editAdvanceCourse = async (req, res) => {
    try {
        const { courseid } = req.params;
        const { coursename, description, price } = req.body;

        const course = await AdvanceCourseModel.findOneAndUpdate(
            { courseid },
            { coursename, description, price },
            { new: true, runValidators: true }
        );

        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }

        return res.status(200).json({
            message: "Course updated successfully.",
            course
        });
    } catch (error) {
        console.error("Error while editing course:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
const getAllAdvanceCourse = async (req, res) => {
    try {
        const allCourse = await AdvanceCourseModel.find();

        if (allCourse.length === 0) {
            return res.status(404).json({
                message: "No courses found!",
                data: []
            });
        }

        return res.status(200).json({
            message: "The list of courses is as follows:",
            data: allCourse
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error!",
            error: error.message
        });
    }
};


module.exports = {
    addAdvanceCourse,
    editAdvanceCourse,
    getAllAdvanceCourse
}
const FacultyModel = require("../model/FacultyModel")

const addFaculty = async (req, res) => {
    try {
        const AdminEmail = req.user?.email
        const { name, subject, image, qualification, experience, contact, bio } = req.body;

        if (!name || !subject || !image || !qualification || !experience || !contact || !bio) {
            return res.status(400).json({
                message: "Please provide all required fields."
            });
        }

        const registeredFaculty = await FacultyModel.findOne({ contact: contact });

        if (registeredFaculty) {
            const updatedFaculty = await FacultyModel.findOneAndUpdate(
                { contact: contact },
                { name, subject, image, qualification, experience, bio },
                { new: true }
            );

            return res.status(200).json({
                message: "Faculty updated successfully!",
                faculty: updatedFaculty
            });
        }

        const newFaculty = await FacultyModel.create({
            name,
            bio,
            subject,
            image,
            qualification,
            experience,
            contact
        });

        return res.status(201).json({
            message: "Faculty added successfully!",
            faculty: newFaculty
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};
const getAllFaculty = async (req, res) => {
    try {
        const faculties = await FacultyModel.find();

        return res.status(200).json({
            message: "Faculties retrieved successfully!",
            faculties: faculties,
            labels: {
                name: "Full Name",
                bio: "About Faculty",
                subject: "Subject",
                qualification: "Qualification",
                experience: "Teaching Experience",
                contact: "Email ID",
                image: "Profile Photo",
            }
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};
const getFacultyById = async (req, res) => {
    try {
        const id = req.params.id;
        const faculty = await FacultyModel.findById(id);

        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }

        return res.status(200).json({
            message: "Faculty retrieved successfully",
            faculty: faculty
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};
const Facultycount = async (req, res) => {
    try {
        const email=req.user?.email
        if(!email){
            return res.status(404).json({
                message:"You are not authencticated for this route",
            })
        }
        const f_count = await FacultyModel.countDocuments()
        res.json({ count: f_count })
    } catch (error) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
}
module.exports = {
    addFaculty,
    getAllFaculty,
    getFacultyById,
    Facultycount
};

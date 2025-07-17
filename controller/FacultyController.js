const FacultyModel = require("../model/FacultyModel")
const mailer = require("../util/SendMailFaculty")
const facultyLoginModel = require("../model/FacultyLoginModel")
const bcrypt = require("bcrypt")

const addFaculty = async (req, res) => {
    try {
        const AdminEmail = req.user?.email
        if (!AdminEmail) return null;

        const { name, subject, image, qualification, experience, contact, bio } = req.body;

        if (!name || !subject || !image || !qualification || !experience || !contact || !bio) {
            return res.status(400).json({
                message: "Please provide all required fields."
            });
        }

        const registeredFaculty = await FacultyModel.findOne({ contact: contact });

        if (registeredFaculty) {
            // const updatedFaculty = await FacultyModel.findOneAndUpdate(
            //     { contact: contact },
            //     { name, subject, image, qualification, experience, bio },
            //     { new: true }
            // );

            return res.status(409).json({
                message: "Faculty Already Added!",
            });
        }

        const passwordFaculty = [...Array(10)].map(() => Math.random().toString(36)[2]).join('')
        console.log(passwordFaculty);

        const hashedPassowrd = await bcrypt.hash(passwordFaculty, 10)

        const newFaculty = await FacultyModel.create({
            name,
            bio,
            subject,
            image,
            qualification,
            experience,
            contact // must be an email !
        });

        await facultyLoginModel.create({ email: contact, password: hashedPassowrd, facultyInfo: newFaculty._id })

        const Mailsubject = "Congratulations! You’re Now Part of the PadhaiHub Faculty Team"
        const text = `Dear <h2>${name}</h2>,

Welcome to PadhaiHub! 🎓  
We’re excited to have you as part of our faculty team.

Your login credentials have been successfully created. Please find your details below:

Email: <h3>${contact}</h3>
Password: <h3>${passwordFaculty}</h3>

You can log in to your faculty dashboard here:  
https://padhaihub.com/faculty/login

Once logged in, we recommend changing your password for security reasons.

If you face any issues while logging in or have any questions, feel free to reach out to us at support@padhaihub.com.

Looking forward to a great journey ahead!

Best regards,  
Admin PadhaiHub  
https://padhaihub-one.vercel.app/
`
        await mailer.sendMail(contact, Mailsubject, text)

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
const getFacultyByEmail = async (req, res) => {
    try {
        const { contact } = req.query;

        if (!contact) {
            return res.status(400).json({ message: "Email is required" });
        }

        const faculty = await FacultyModel.findOne({ contact });
        console.log(faculty);

        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }

        return res.status(200).json({
            message: "Faculty retrieved successfully",
            faculty
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
        const email = req.user?.email
        if (!email) {
            return res.status(404).json({
                message: "You are not authencticated for this route",
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
    getFacultyByEmail,
    Facultycount
};

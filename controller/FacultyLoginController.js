const facultyModel = require("../model/FacultyLoginModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const handleLoginFaculty = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);

        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter all the fields!",
            });
        }

        const FacultyLogin = await facultyModel.findOne({ email });

        if (!FacultyLogin) {
            return res.status(401).json({ message: "Invalid email or password!" });
        }

        const isMatch = await bcrypt.compare(password, FacultyLogin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password!" });
        }

        const token = jwt.sign(
            {
                id: FacultyLogin._id,
                email: FacultyLogin.email,
                role: FacultyLogin.role,
            },
            process.env.JWT_SECRET || "Galu_0106",
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            message: "Faculty Logged In successfully!",
            redirecturl: "/faculty/dashboard",
            token: token,
            email: email,
            role: FacultyLogin.role,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error!",
            error: error.message
        });
    }
};

module.exports = {
    handleLoginFaculty
};

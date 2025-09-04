const mailer = require("../util/SendMailFaculty")
const { subjects, experience, FacultyModel, degrees } = require("../model/FacultyModel")
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
        //         const text = `Dear <h2>${name}</h2>,

        // Welcome to PadhaiHub! 🎓  
        // We’re excited to have you as part of our faculty team.

        // Your login credentials have been successfully created. Please find your details below:

        // Email: <h3>${contact}</h3>
        // Password: <h3>${passwordFaculty}</h3>

        // You can log in to your faculty dashboard here:  
        // https://padhaihub-one.vercel.app/faculty/login

        // Once logged in, we recommend changing your password for security reasons.

        // If you face any issues while logging in or have any questions, feel free to reach out to us at support@padhaihub.com.

        // Looking forward to a great journey ahead!

        // Best regards,  
        // Admin PadhaiHub  
        // https://padhaihub-one.vercel.app/`
        const mailText = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
    </head>
    <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:20px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background-color:#2563eb; color:#ffffff; padding:20px; text-align:center; font-size:20px; font-weight:bold;">
                  PadhaiHub 🎓
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:30px; color:#333;">
                  <p style="font-size:16px; margin:0 0 15px 0;">Dear <strong>${name}</strong>,</p>

                  <p style="font-size:15px; margin:0 0 20px 0;">
                    Welcome to <strong>PadhaiHub</strong>! We’re excited to have you as part of our faculty team.
                  </p>

                  <p style="font-size:15px; margin:0 0 15px 0;">
                    Your login credentials have been successfully created. Please find your details below:
                  </p>

                  <!-- Credentials Box -->
                  <table width="100%" cellpadding="10" cellspacing="0" style="background-color:#f9fafb; border:1px solid #e5e7eb; border-radius:6px; margin:20px 0;">
                    <tr>
                      <td style="font-size:15px;"><strong>Email:</strong> ${contact}</td>
                    </tr>
                    <tr>
                      <td style="font-size:15px;"><strong>Password:</strong> ${passwordFaculty}</td>
                    </tr>
                  </table>

                  <p style="font-size:15px; margin:0 0 15px 0;">
                    You can log in to your faculty dashboard here:
                  </p>

                  <!-- Button -->
                  <p style="text-align:center;">
                    <a href="https://padhaihub-one.vercel.app/faculty/login" 
                       style="background-color:#2563eb; color:#ffffff; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:bold; display:inline-block;">
                      Faculty Dashboard
                    </a>
                  </p>

                  <p style="font-size:14px; color:#555; margin:20px 0;">
                    Once logged in, we recommend changing your password for security reasons.
                  </p>

                  <p style="font-size:14px; color:#555; margin:0 0 20px 0;">
                    If you face any issues while logging in or have any questions, feel free to reach out to us at 
                    <a href="mailto:support@padhaihub.com" style="color:#2563eb; text-decoration:none;">support@padhaihub.com</a>.
                  </p>

                  <p style="font-size:15px; margin:0;">
                    Looking forward to a great journey ahead!
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color:#f1f5f9; text-align:center; padding:15px; font-size:13px; color:#555;">
                  Best regards,<br/>
                  <strong>Admin PadhaiHub</strong><br/>
                  <a href="https://padhaihub-one.vercel.app/" style="color:#2563eb; text-decoration:none;">
                    https://padhaihub-one.vercel.app/
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
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
                image: "Profile Photo Link",
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
const FacultySubject = async (req, res) => {
    try {
        return res.status(202).json(subjects)
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error !"
        })
    }
}
const FacultyExperience = async (req, res) => {
    try {
        return res.status(202).json(experience)
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error !"
        })
    }
}
const FacultyDegree = async (req, res) => {
    try {
        return res.status(202).json(degrees)
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error !"
        })
    }
}
module.exports = {
    addFaculty,
    getAllFaculty,
    getFacultyByEmail,
    Facultycount,
    FacultySubject,
    FacultyExperience,
    FacultyDegree
};

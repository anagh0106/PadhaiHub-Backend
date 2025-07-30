const signupModel = require("../model/SignupModel");
const LoginModel = require("../model/LoginModel")
const studentInfoModel = require("../model/StudentInfoModel")
const { Counter } = require("../model/StudentDashboardModel")
const { TodoList } = require("../model/StudentDashboardModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const mailer = require("../util/MailUtil")
const otpSchema = require("../model/OTPSchema")
const otpsender = require("../util/OTPSender")
const si = require('systeminformation');
const SubmissionModel = require("../model/MockTestSubmissionModel")

const SendOTPOnForgotPassword = async (req, res) => {
    try {
        const userEmail = req.body.email;
        if (!userEmail) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Check if the email exists in LoginModel
        const emailRecord = await signupModel.findOne({ email: userEmail });
        console.log("Email Record:", emailRecord); // Debug
        if (!emailRecord) {
            return res.status(404).json({ message: "Email not found" });
        }

        // Generate OTP
        const myotp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
        console.log("Generated OTP:", myotp); // Debug

        // Save OTP in the database
        // await otpSchema.create({ email: userEmail, otp: myotp, createdAt: Date.now() });
        await otpSchema.create({
            email: userEmail,
            otp: myotp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes validity
        });
        // Retrieve user details from signupModel
        const user = await signupModel.findOne({ email: userEmail });
        console.log("User Record:", user); // Debug
        if (!user) {
            return res.status(404).json({ message: "User not found in signup records" });
        }

        // Send OTP email
        try {
            await otpsender.sendMail(
                userEmail,
                "OTP to Create a New Password",
                `Hello ${user.firstname}, Your One - Time Password(OTP) for BloodSync is: ${myotp}.`
            );
            console.log("OTP email sent successfully");
        } catch (emailError) {
            console.error("Error sending email:", emailError);
            throw new Error("Failed to send OTP email");
        }

        res.status(200).json({
            message: "OTP Sent Successfully!!",
            redirectUrl: "/Otppage",
        });


    } catch (err) {
        console.error("Error in SendOTPToMail:", err);
        res.status(500).json({
            message: "Something went wrong",
            error: err.message,
        });
    }
};
const verifyOTP = async (req, res) => {
    try {
        const { otp, email } = req.body;

        console.log("Request OTP:", otp);

        // Validate input
        if (!otp || !email) {
            return res.status(400).json({ message: "OTP and email are required." });
        }

        // Fetch stored OTP from database (case-insensitive email match)
        const storedOtp = await otpSchema.findOne({ email: new RegExp(`^${email}$`, "i") });

        if (!storedOtp) {
            return res.status(404).json({ message: "OTP not found for this email." });
        }

        console.log("Stored OTP from DB:", storedOtp);

        // Ensure stored OTP exists before comparison
        if (!storedOtp.otp) {
            return res.status(400).json({ message: "Invalid OTP record." });
        }

        // ✅ Convert OTP to string before comparison to prevent trim error
        if (otp.toString().trim() !== storedOtp.otp.toString().trim()) {
            return res.status(401).json({ message: "Invalid OTP." });
        }

        // Check if OTP is expired
        if (new Date(storedOtp.expiresAt) < new Date()) {
            return res.status(400).json({ message: "OTP has expired." });
        }

        // OTP verification successful
        res.status(200).json({ message: "OTP verified successfully." });

        // Delete OTP after successful verification
        await otpSchema.deleteOne({ email: new RegExp(`^${email}$`, "i") });

    } catch (err) {
        console.error("Error in VerifyOTP:", err);
        res.status(500).json({
            message: "Error in verifying OTP.",
            error: err.message,
        });
    }
};
const updatePassword = async (req, res) => {
    try {
        const { password, email } = req.body;

        // Validate input
        if (!password && !email) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user's password
        const updatedUser = await signupModel.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ message: "Failed to update password." });
        }

        // Delete OTP after successful password update
        await otpSchema.deleteOne({ email });

        // Return success message
        res.status(200).json({
            message: "Password updated successfully.",
            redirectUrl: "/login",
        });
    } catch (err) {
        res.status(500).json({
            message: "Error in updating password.",
            error: err.message,
        });
    }
};
// const UserSignup = async (req, res) => {
//     try {
//         console.log(req.body);
//         const { email, password, deviceType, deviceId } = req.body;

//         const adminEmails = ["anagh0106@gmail.com"];

//         // ✅ Check if email already exists
//         const existingUser = await signupModel.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "Email already exists." });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const role = adminEmails.includes(email) ? "admin" : "user";

//         let DeviceID = "";

//         // ✅ For regular users, check device ID
//         if (role === "user") {
//             if (deviceType === "laptop" || deviceType === "desktop") {
//                 const motherboardInfo = await si.baseboard();
//                 DeviceID = motherboardInfo.serial?.trim() || "UNKNOWN_LAPTOP";
//             } else if (deviceType === "mobile") {
//                 DeviceID = deviceId || "UNKNOWN_MOBILE";
//             }

//             if (!DeviceID || DeviceID.includes("UNKNOWN")) {
//                 return res.status(400).json({
//                     message: "Device ID could not be retrieved. Please try again.",
//                 });
//             }

//             const existingDevice = await signupModel.findOne({ MotherboardID: DeviceID });
//             if (existingDevice) {
//                 return res.status(400).json({
//                     message: "This device is already registered.",
//                 });
//             }
//         }

//         const currentYear = new Date().getFullYear();

//         // ✅ Step 1: Create user to get auto-generated studentSeq
//         const saveUser = await signupModel.create({
//             ...req.body,
//             password: hashedPassword,
//             role,
//             MotherboardID: role === "user" ? DeviceID : undefined,
//             admissionYear: currentYear,
//         });

//         // ✅ Step 2: Generate studentId using that unique studentSeq
//         if (role === "user" && saveUser.studentSeq) {
//             const studentId = `STU-100-${currentYear}${String(saveUser.studentSeq).padStart(4, "0")}`;

//             // ✅ Final safety check — avoid duplicate studentId even if rare plugin issue
//             const exists = await signupModel.findOne({ studentId });

//             if (exists) {
//                 // Clean up created user — shouldn't happen normally
//                 await signupModel.findByIdAndDelete(saveUser._id);
//                 return res.status(500).json({
//                     success: false,
//                     message: "Generated student ID already exists. Please try again.",
//                 });
//             }

//             // ✅ Assign and save
//             saveUser.studentId = studentId;
//             await saveUser.save();
//         }

//         return res.status(201).json({
//             success: true,
//             message: "User created successfully",
//             userData: saveUser,
//             redirectUrl: "/signin",
//         });
//     } catch (error) {
//         console.error("Error during signup:", error);
//         return res.status(500).json({
//             message: "An error occurred during signup. Please try again later.",
//         });
//     }
// };
const UserSignup = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password, deviceType, deviceId } = req.body;

        const adminEmails = ["anagh0106@gmail.com"];

        // ✅ Check if email already exists
        const existingUser = await signupModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const role = adminEmails.includes(email) ? "admin" : "user";

        let DeviceID = "";

        // ✅ For regular users, check device ID
        // if (role === "user") {
        //     if (deviceType === "laptop" || deviceType === "desktop") {
        //         const motherboardInfo = await si.baseboard();
        //         DeviceID = motherboardInfo.serial?.trim() || "UNKNOWN_LAPTOP";
        //     } else if (deviceType === "mobile") {
        //         DeviceID = deviceId || "UNKNOWN_MOBILE";
        //     }

        //     if (!DeviceID || DeviceID.includes("UNKNOWN")) {
        //         return res.status(400).json({
        //             message: "Device ID could not be retrieved. Please try again.",
        //         });
        //     }

        //     const existingDevice = await signupModel.findOne({ MotherboardID: DeviceID });
        //     if (existingDevice) {
        //         return res.status(400).json({
        //             message: "This device is already registered.",
        //         });
        //     }
        // }

        const currentYear = new Date().getFullYear();

        // ✅ Step 1: Create user without studentId yet
        const saveUser = new signupModel({
            ...req.body,
            password: hashedPassword,
            role,
            MotherboardID: role === "user" ? DeviceID : undefined,
            admissionYear: currentYear,
        });

        await saveUser.save(); // Save initially

        // ✅ Step 2: Generate studentId safely
        if (role === "user" && saveUser.studentSeq) {
            const studentId = `STU-100-${currentYear}${String(saveUser.studentSeq).padStart(4, "0")}`;

            // Double-check no other user has same studentId (extremely rare)
            const exists = await signupModel.findOne({ studentId });
            if (exists) {
                await signupModel.findByIdAndDelete(saveUser._id);
                return res.status(500).json({
                    success: false,
                    message: "Generated student ID already exists. Please try again.",
                });
            }

            saveUser.studentId = studentId;
            await saveUser.save(); // Save studentId update
        }

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            userData: saveUser,
            redirectUrl: "/signin",
        });

    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).json({
            message: "An error occurred during signup. Please try again later.",
        });
    }
};
const loginUser = async (req, res) => {
    try {
        const { email, password, deviceType, deviceId } = req.body;

        const user = await signupModel.findOne({ email });
        // console.log(user);

        if (!user) {
            return res.status(404).json({
                message: "Email ID Doesn't Exist",
                status: 404,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Email or Password Not Found",
                status: 400,
            });
        }

        // console.log("User Info:", user.role, user.MotherboardID); // 🧪 Debug log        

        // ✅ If not admin, perform device check
        // if (user.role !== 'admin') {
        //     let currentDeviceID = "";
        //     if (deviceType === "laptop") {
        //         const currentMotherboardInfo = await si.baseboard();
        //         currentDeviceID = currentMotherboardInfo.serial.trim();
        //     } else {
        //         currentDeviceID = deviceId;
        //     }

        //     const storedDeviceID = user.MotherboardID?.trim();

        //     console.log("Current Device ID:", currentDeviceID);
        //     console.log("Stored Device ID:", storedDeviceID);
        //     if (currentDeviceID !== storedDeviceID) {
        //         return res.status(403).json({
        //             message: "You cannot log in from another device",
        //             status: 403,
        //         });
        //     }
        // }
        // if (user.role !== 'admin') {
        //     let currentDeviceID = "";

        //     if (deviceType === "laptop" || deviceType === "desktop") {
        //         const currentMotherboardInfo = await si.baseboard();
        //         currentDeviceID = currentMotherboardInfo?.serial?.trim() || "UNKNOWN_LAPTOP";
        //     } else if (deviceType === "mobile") {
        //         currentDeviceID = deviceId?.trim() || "UNKNOWN_MOBILE";
        //     } else {
        //         return res.status(400).json({
        //             message: "Unknown device type. Cannot authenticate device.",
        //         });
        //     }

        //     const storedDeviceID = user.MotherboardID?.trim() || "UNKNOWN";

        //     console.log("Current Device ID:", currentDeviceID);
        //     console.log("Stored Device ID:", storedDeviceID);

        //     if (currentDeviceID !== storedDeviceID) {
        //         return res.status(403).json({
        //             message: "You cannot log in from another device",
        //             status: 403,
        //         });
        //     }
        // }

        // ✅ Generate Token
        const createdToken = jwt.sign(
            { email: user.email, id: user._id, role: user.role },
            "Galu_0106",
        );
        console.log(createdToken);


        // ✅ Update login logs with studentId
        await LoginModel.findOneAndUpdate(
            { email: user.email },
            {
                $set: {
                    lastLogin: new Date(),
                    studentId: user.role === 'admin' ? "Admin" : user.studentId,
                }
            },
            { upsert: true, new: true }
        );

        // await mailer.sendMail(user.email, "Welcome to PadhaiHub", "Dear Student...");

        res.cookie("authToken", createdToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            maxAge: 60 * 1000, // Token expires in 1 minute
        });

        return res.status(200).json({
            success: true,
            message: user.role === 'admin' ? "Admin Login Successful" : "You Have Logged In Successfully",
            token: createdToken,
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                studentId: user.studentId,
            },
            redirectUrl: user.role === 'admin' ? "/admin/dashboard" : "/",
        });

    } catch (error) {
        console.error("Error during login:", error);

        res.status(500).json({
            message: "Something Went Wrong!!",
            error: error.message,
            status: 500,
        });
    }
};
const usercount = async (req, res) => {
    try {
        const userCount = await signupModel.countDocuments({ role: 'user' || 'User' });
        console.log(userCount);
        
        res.json({ count: userCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
}
const deleteAccount = async (req, res) => {
    const email = req.user?.email;
    const password = req.body.password;

    if (!email) {
        return res.status(401).json({ message: "Unauthorized User!" });
    }

    if (!password) {
        return res.status(400).json({
            message: "Please enter password to delete your account."
        });
    }

    try {
        // Fetch user from signupModel
        const user = await signupModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Compare password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password." });
        }
        // Delete all data
        await Promise.all([
            signupModel.findOneAndDelete({ email }),
            LoginModel.findOneAndDelete({ email }),
            studentInfoModel.findOneAndDelete({ email }),
            TodoList.deleteMany({ email }),
            Counter.deleteOne({ email }),
            SubmissionModel.deleteMany({ email })
        ]);
        const deleteText = "You have deleted Your Account Successfully!!"
        await mailer.sendMail(user.email, `Dear Student ${user.username}`, deleteText);

        return res.status(200).json({ message: "Account deleted successfully." });

    } catch (error) {
        console.error("Error deleting account:", error);
        return res.status(500).json({ message: "Failed to delete account." });
    }
};
const getallStudents = async (req, res) => {
    const email = req.user?.email;

    try {
        if (!email) {
            return res.status(404).json({
                message: "Please provide email id to access this route!"
            });
        }

        const studentsInfo = await studentInfoModel.find();

        if (!studentsInfo || studentsInfo.length === 0) {
            return res.status(404).json({
                message: "No student information found!"
            });
        }

        return res.status(200).json({
            students: studentsInfo,
            labels: {
                studentId: "StudentId",
                grade: "Grade",
                group: "Group",
                name: "Full Name",
                phone: "Contact No",
                address: "Address",
            }
        }); // use plural key for clarity
    } catch (error) {
        console.error("Error fetching students:", error);
        return res.status(500).json({
            message: "Internal server error. Data not found!"
        });
    }
};

module.exports = {
    UserSignup,
    loginUser,
    SendOTPOnForgotPassword,
    updatePassword,
    verifyOTP,
    usercount,
    deleteAccount,
    getallStudents
};



// User Signup IMP Code

// const UserSignup = async (req, res) => {
//     try {
//         console.log(req.body);
//         const { email, password, deviceType, deviceId } = req.body;

//         const adminEmails = ["anagh0106@gmail.com"];

//         const existingUser = await signupModel.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "Email already exists." });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const role = adminEmails.includes(email) ? "admin" : "user";

//         let DeviceID = "";

//         if (role === "user") {
//             if (deviceType === "laptop" || deviceType === "desktop") {
//                 const motherboardInfo = await si.baseboard();
//                 DeviceID = motherboardInfo.serial ? motherboardInfo.serial.trim() : "UNKNOWN_LAPTOP";
//             } else if (deviceType === "mobile") {
//                 DeviceID = deviceId || "UNKNOWN_MOBILE";
//             }

//             if (!DeviceID || DeviceID.includes("UNKNOWN")) {
//                 return res.status(400).json({
//                     message: "Device ID could not be retrieved. Please try again.",
//                 });
//             }

//             const existingDevice = await signupModel.findOne({ MotherboardID: DeviceID });
//             if (existingDevice) {
//                 return res.status(400).json({
//                     message: "This device is already registered.",
//                 });
//             }
//         }

//         const currentYear = new Date().getFullYear();

//         const saveUser = await signupModel.create({
//             ...req.body,
//             password: hashedPassword,
//             role,
//             MotherboardID: role === "user" ? DeviceID : undefined,
//             admissionYear: currentYear,
//         });

//         // 👇 Generate student ID after record is created
//         if (role === "user" && saveUser.studentSeq) {
//             const studentId = `STU-100-${currentYear}${String(saveUser.studentSeq).padStart(4, "0")}`;
//             saveUser.studentId = studentId;
//             await saveUser.save();
//         }

//         return res.status(201).json({
//             success: true,
//             message: "User created successfully",
//             userData: saveUser,
//             redirectUrl: "/signin",
//         });
//     } catch (error) {
//         console.error("Error during signup:", error);
//         return res.status(500).json({
//             message: "An error occurred during signup. Please try again later.",
//         });
//     }
// };
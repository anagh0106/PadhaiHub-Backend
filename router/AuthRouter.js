const express = require("express")
const router = express.Router();
const AuthController = require("../controller/AuthController");
const StudentInfoController = require("../controller/StudentInfoController")
const authMiddleware = require("../middleware/AuthMiddleware");
const StudentInfoModel = require("../model/StudentInfoModel");
const requireRole = require("../middleware/RoleMiddleware")
const profileImage = require("../middleware/ProfileMiddleware")

router.post("/signup", AuthController.UserSignup);
router.post("/login", AuthController.loginUser);
router.post("/forgotpassword", AuthController.SendOTPOnForgotPassword);
router.post("/verify", AuthController.verifyOTP);
router.get("/getcount", AuthController.usercount)
router.post("/updatepassword", AuthController.updatePassword);

router.post(
    "/submit-student-info",
    authMiddleware,
    // profileImage.single("profile"),
    requireRole("user"),
    StudentInfoController.saveStudentInfo
);
router.get(
    "/student-id-exists",
    authMiddleware,
    requireRole("user"),
    StudentInfoController.checkStudentIdExists);
router.put(
    "/update-student-info",
    authMiddleware,
    requireRole("user"),
    StudentInfoController.updateStudentInfo
);
router.get("/getStudentInfo",
    // authMiddleware,
    // requireRole("user"),
    StudentInfoController.getStudentInfo
)
router.get("/check-student-info", authMiddleware, requireRole("user")
    , async (req, res) => {
        const userEmail = req.user?.email;
        const existing = await StudentInfoModel.findOne({ email: userEmail });

        if (existing) {
            return res.json({ alreadySubmitted: true });
        } else {
            return res.json({ alreadySubmitted: false });
        }
    });

router.delete("/deleteAccount",
    authMiddleware,
    requireRole("user"),
    AuthController.deleteAccount
)
router.get("/getAllStudents",
    authMiddleware,
    requireRole("admin"),
    AuthController.getallStudents
)
module.exports = router
const express = require("express");
const mongoose = require("mongoose")
const cors = require("cors");
const { dbConnection } = require("./util/DbConnection");
const app = express();
const PORT = process.env.PORT || 3000;

require("dotenv").config();


mongoose.set('strictQuery', false);

dbConnection();
app.use(express.json());
const allowedOrigins = [
    "https://padhaihub-one.vercel.app",
    "http://localhost:3000"
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like Postman or mobile apps)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

// Handle preflight requests for all routes
app.options("*", cors());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const authuser = require("./router/AuthRouter")
const Contactus = require("./router/ContactRouter")
const ReviewRouter = require("./router/ReviewRouter")
const stuDashboardRouter = require("./router/StudentDashboardRouter")
const CourseRouter = require("./router/CourseRouter")
const VideoRouter = require("./router/VideoRouter")
const CardRouter = require("./router/CardRouter")
const FacultyRouter = require("./router/FacultyRouter")
const AdvanceCourseRouter = require("./router/AdvanceCourseRouter")
const FormulaRouter = require("./router/FormulaRouter")
const ClassRouter = require("./router/ClassManagementRouter")
const AdminMockTest = require("./router/AdminMockTestRouter")
const QuestionTestByAdmin = require("./router/AdminTestQuestionRouter")
const TestAction = require("./router/MockTestSubmissionRouter")
const FacultyLogin = require("./router/FacultyLoginRouter")
const homepageRouter = require("./router/HomePageRouter")
const courseCard = require("./router/CourseCardRouter")
// const PredictionPython = require("./router/AdminMockTestRouter")
app.use("/home", homepageRouter)
app.use('/uploads', express.static('uploads'));
app.use("/user", authuser);
app.use("/contact", Contactus);
app.use("/review", ReviewRouter);
app.use("/todolist", stuDashboardRouter);
app.use("/course", CourseRouter)
app.use("/video", VideoRouter)
app.use('/cards', CardRouter)
app.use("/faculty", FacultyRouter)
app.use("/advanceCourse", AdvanceCourseRouter)
app.use("/formula", FormulaRouter)
// app.use("/predict", PredictionPython)
app.use("/class", ClassRouter)
app.use("/mocktest", AdminMockTest)
app.use("/questionTest", QuestionTestByAdmin)
app.use("/test", TestAction)
app.use("/fac", FacultyLogin)
app.use("/courseCard", courseCard)
app.get("/testing", (req, res) => {
    res.json({
        status: "Live ✅",
        backend: "PadhaiHub-Backend",
        timestamp: new Date().toISOString()
    });
});


app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port http://192.168.31.252:${PORT}`);
    console.log(`Server is running on port http://localhost:${PORT}`);
    console.log(`Server is running on port https://padhaihub-backend.onrender.com`);
});


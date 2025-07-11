const classModel = require("../model/ClassManagementModel")
const FacultyData = require("../model/FacultyModel")
const { CourseModel } = require("../model/CourseModel");
const StudentInfoModel = require("../model/StudentInfoModel");

const createClass = async (req, res) => {
    try {
        const { subject, standard, faculty, time, room, date } = req.body;
        const email = req.user?.email;

        if (!email) {
            return res.status(403).json({ message: "You are not permitted to access this" });
        }
        const facultydata = await FacultyData.findById(faculty.trim());
        if (!facultydata) {
            return res.status(404).json({ message: "Faculty not found" });
        }

        if (!facultydata.subject.includes(subject)) {
            return res.status(400).json({ message: `Selected faculty does not teach ${subject}` });
        }
        // past date and time handler
        const classDateTime = new Date(`${date}T${time}`);
        const now = new Date();

        if (classDateTime < now) {
            return res.status(400).json({
                message: "You cannot create a class for a past time"
            });
        }

        // ⛔ Clash check
        const timeToMinutes = (t) => {
            const [hrs, mins] = t.split(":").map(Number);
            return hrs * 60 + mins;
        };

        const facultyClasses = await classModel.find({ date, faculty: facultydata._id });
        const requestedTime = timeToMinutes(time);
        const isClash = facultyClasses.some(cls => {
            const classTime = timeToMinutes(cls.time);
            return Math.abs(classTime - requestedTime) < 120;
        });

        if (isClash) {
            return res.status(400).json({
                message: "⚠️ Selected faculty is already assigned in this time slot."
            });
        }

        // ✅ Create class
        const newClass = new classModel({
            subject,
            standard,
            faculty: facultydata._id,
            time,
            room,
            date
        });

        const savedClass = await newClass.save();
        const populated = await savedClass.populate("faculty");

        res.status(201).json(populated);

    } catch (error) {
        console.error("Create class error:", error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
};
const getClass = async (req, res) => {
    try {
        const classes = await classModel.find().populate("faculty")

        const today = new Date().toISOString().split("T")[0]
        const previousClasses = classes.filter(t => new Date(t.date).toISOString().split("T")[0] < today)
        const upComingClasses = classes.filter(t => new Date(t.date).toISOString().split("T")[0] >= today)

        res.status(201).json({
            classes,
            previousClasses,
            upComingClasses,
            label: {
                previousClasses: "previousClasses",
                upComingClasses: "upComingClasses"
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}
const getSubjectName = async (req, res) => {
    try {
        const subjects = await CourseModel.find();

        if (!subjects) {
            return res.status(404).json({
                message: "Subjects Not Found !"
            })
        }
        return res.status(200).json({
            subjects
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error!!"
        })
    }
}
const getStandard = async (req, res) => {
    try {
        const std = await classModel.distinct("standard"); // gives unique values only
        return res.status(200).json({ standards: std });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error!!" });
    }
};
const getGroup = async (req, res) => {
    try {
        const grp = await StudentInfoModel.distinct("group")
        return res.status(200).json({ grp });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error!!" });
    }
}
const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
};
const usedRooms = async (req, res) => {
    const { date, time } = req.query;

    if (!date || !time) {
        return res.status(400).json({ message: "Date and time are required" });
    }

    const requestedTime = timeToMinutes(time);

    try {
        const classes = await classModel.find({ date });


        const usedRooms = [];

        classes.forEach(cls => {
            const classTime = timeToMinutes(cls.time);
            const timeDiff = Math.abs(classTime - requestedTime);

            if (timeDiff < 120) {
                usedRooms.push(cls.room);
            }
        });

        const uniqueRooms = [...new Set(usedRooms)];

        res.status(200).json({ rooms: uniqueRooms });
    } catch (err) {
        console.error("Error while checking used rooms:", err);
        res.status(500).json({ message: "Server error" });
    }
};
const usedFaculty = async (req, res) => {
    const { date, time, faculty } = req.query;

    if (!date || !time || !faculty) {
        return res.status(400).json({ message: "Date, time and faculty are required" });
    }

    const requestedTime = timeToMinutes(time);

    try {
        const facClasses = await classModel.find({ date, faculty });
        const isAssigned = facClasses.some(cls => {
            const classTime = timeToMinutes(cls.time);
            const timeDiff = Math.abs(classTime - requestedTime);
            return timeDiff < 120; // clash within 2 hours
        });

        if (isAssigned) {
            return res.status(200).json({ assigned: true });
        } else {
            return res.status(200).json({ assigned: false });
        }

    } catch (error) {
        console.error("Error while checking assigned faculties:", error);
        res.status(500).json({ message: "Server error" });
    }
};
const deleteClass = async (req, res) => {
    const { id } = req.query;

    try {
        const deleted = await classModel.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Class not found" });
        }

        res.status(200).json({ message: "Class deleted successfully", deleted });
    } catch (error) {
        console.error("Error while Deleting class:", error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
};
const countActiveClass = async (req, res) => {

    const email = req.user?.email

    try {
        if (!email) {
            return res.status(404).json({
                message: "You are not authencticated for this route"
            })
        }
        const today = new Date().toISOString().split("T")[0]
        const UpcomingClassCount = (await classModel.find({ date: { $gt: today } })).length
        const activeClass = (await classModel.find({ date: { $eq: today } })).length

        return res.status(201).json({ upcomingCount: UpcomingClassCount, activeCount: activeClass })
    } catch (error) {
        console.error("Error while counting Active classes:", error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}
const upComingLiveClass = async (req, res) => {
    const today = new Date();
    const formatted = today.toISOString().split('T')[0];
    console.log(formatted);

    try {
        const counts = await classModel.countDocuments({ date: { $gt: formatted } })
        return res.status(201).json({ counts })

    } catch (error) {
        console.error("Error while counting Upcoming Count of classes:", error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}
module.exports = {
    createClass,
    getClass,
    getSubjectName,
    usedRooms,
    usedFaculty,
    deleteClass,
    countActiveClass,
    upComingLiveClass,
    getStandard,
    getGroup
}
const Course = require('../model/CourseCardModel');

exports.createCourse = async (req, res) => {
    try {
        const course = new Course(req.body);
        const savedCourse = await course.save();
        res.status(201).json(savedCourse);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ errors: messages });
        }

        res.status(500).json({ error: 'Something went wrong.' });
    }
};

exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        console.log(courses);

        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch courses.' });
    }
};
const express = require('express');
const router = express.Router();
const courseController = require('../controller/CourseCardController');

// POST /api/courses → Create new course
router.post('/addCourse', courseController.createCourse);

// GET /api/courses → Get all courses
router.get('/', courseController.getCourses);

module.exports = router;

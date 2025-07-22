const express = require('express');
const router = express.Router();
const courseController = require('../controller/CourseCardController');

router.post('/addCourse', courseController.createCourse);

router.get('/getCourse', courseController.getCourses);

module.exports = router;

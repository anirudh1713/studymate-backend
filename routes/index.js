const express = require('express');

const adminRoute = require('./admin.route');
const studentRoute = require('./student.route');
const departmentRoute = require('./department.route');
const facultyRoute = require('./faculty.route');

const router = express.Router();

router.use('/admin', adminRoute);
router.use('/student', studentRoute);
router.use('/department', departmentRoute);
router.use('/faculty', facultyRoute);

module.exports = router;

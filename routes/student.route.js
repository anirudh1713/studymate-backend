const express = require('express');

const { studentController } = require('../controllers');
const validate = require('../middlewares/validate');
const { studentValidation } = require('../validations');

const router = express.Router();

router
    .route('/signup')
    .post(validate(studentValidation.createStudent), studentController.createStudent);

router
    .route('/login')
    .post(validate(studentValidation.loginStudent), studentController.loginStudent);

module.exports = router;
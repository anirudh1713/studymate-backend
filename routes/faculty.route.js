const express = require('express');

const { facultyController } = require('../controllers');
const validate = require('../middlewares/validate');
const { facultyValidation } = require('../validations');

const router = express.Router();

router
    .route('/signup')
    .post(validate(facultyValidation.createFaculty), facultyController.createFaculty);

router
    .route('/login')
    .post(validate(facultyValidation.loginFaculty), facultyController.loginFaculty);

module.exports = router;
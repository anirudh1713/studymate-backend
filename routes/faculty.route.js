const express = require('express');

const { auth } = require('../middlewares/auth');
const { facultyController } = require('../controllers');
const validate = require('../middlewares/validate');
const { facultyValidation } = require('../validations');

const ROLES = require('../ROLES');

const router = express.Router();

router
    .route('/signup')
    .post(auth(ROLES.admin), validate(facultyValidation.createFaculty), facultyController.createFaculty);

router
    .route('/login')
    .post(validate(facultyValidation.loginFaculty), facultyController.loginFaculty);

module.exports = router;
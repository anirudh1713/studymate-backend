const express = require('express');

const { auth } = require('../middlewares/auth');
const { studentController } = require('../controllers');
const validate = require('../middlewares/validate');
const { studentValidation } = require('../validations');

const ROLES = require('../ROLES');

const router = express.Router();

router
  .route('/')
  .get(studentController.getStudents)
  .delete(
    auth(ROLES.admin),
    studentController.deleteStudents,
  );

router
  .route('/signup')
  .post(
    auth(ROLES.admin),
    validate(studentValidation.createStudent),
    studentController.createStudent,
  );

router
  .route('/login')
  .post(validate(studentValidation.loginStudent), studentController.loginStudent);

module.exports = router;

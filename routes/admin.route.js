const express = require('express');

const { adminController } = require('../controllers');
const validate = require('../middlewares/validate');
const {
  adminValidation, 
  departmentValidation,
  studentValidation,
 } = require('../validations/index');

const router = express.Router();

router
  .route('/signup')
  .post(validate(adminValidation.createAdmin), adminController.createAdmin);

router
  .route('/login')
  .post(validate(adminValidation.loginAdmin), adminController.loginAdmin);

router
  .route('/department')
  .post(validate(departmentValidation.createDepartment), adminController.createDepartment);

router
  .route('/student/signup')
  .post(validate(studentValidation.createStudent), adminController.createStudent);

router
  .route('/student/login')
  .post(validate(studentValidation.loginStudent), adminController.loginStudent);

module.exports = router;
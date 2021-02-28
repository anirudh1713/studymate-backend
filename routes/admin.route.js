const express = require('express');
const Joi = require('joi');

const { adminController } = require('../controllers');
const validate = require('../middlewares/validate');

const router = express.Router();

router
  .route('/signup')
  .post(adminController.createAdmin);

router
  .route('/login')
  .post(adminController.loginAdmin);

router
  .route('/department')
  .post(adminController.createDepartment);

router
  .route('/student/signup')
  .post(adminController.createStudent);

router
  .route('/student/login')
  .post(adminController.loginStudent);

module.exports = router;
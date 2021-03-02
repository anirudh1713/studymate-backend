const express = require('express');

const { departmentController } = require('../controllers');
const validate = require('../middlewares/validate');
const { departmentValidation } = require('../validations');

const router = express.Router();

router
    .route('/')
    .post(validate(departmentValidation.createDepartment), departmentController.createDepartment);

module.exports = router;
const express = require('express');

const { auth } = require('../middlewares/auth');
const { departmentController } = require('../controllers');
const validate = require('../middlewares/validate');
const { departmentValidation } = require('../validations');

const ROLES = require('../ROLES');

const router = express.Router();

router
    .route('/')
    .post(auth(ROLES.admin), validate(departmentValidation.createDepartment), departmentController.createDepartment)
    .get(departmentController.getDepartments);

module.exports = router;
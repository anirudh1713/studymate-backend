const express = require('express');

const { adminController } = require('../controllers');
const validate = require('../middlewares/validate');
const { adminValidation } = require('../validations');

const router = express.Router();

router.route('/signup').post(validate(adminValidation.createAdmin), adminController.createAdmin);

router.route('/login').post(validate(adminValidation.loginAdmin), adminController.loginAdmin);

module.exports = router;

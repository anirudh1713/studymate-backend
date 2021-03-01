const { validationResult } = require('express-validator');
const Joi = require('joi');

const { duplicate } = require('../utils/db');

const createDepartment = Joi.object({
    name: Joi.string().required(),
    code: Joi.number().required().external(async value => {
        await duplicate('departments', 'code', value);
    }),
    tutionFee: Joi.number().required(),
});

module.exports = {
    createDepartment,
}
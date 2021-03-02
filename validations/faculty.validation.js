const Joi = require('joi');

const { duplicate, exists } = require('../utils/db');

const createFaculty = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().max(15).required().regex(/^[0-9]*$/).external(async value => {
        await duplicate('faculties', 'phone_number', value);
    }),
    departmentId: Joi.number().required().external(async value => {
        await exists('departments', 'id', value);
    }),
});

const loginFaculty = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

module.exports = {
    createFaculty,
    loginFaculty,
}
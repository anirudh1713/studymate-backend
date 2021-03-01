const Joi = require('joi');

const { duplicate, exists } = require('../utils/db');

const createStudent = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required().external(async value => {
        await duplicate('students', 'email', value);
    }),
    phoneNumber: Joi.string().max(15).required().regex(/^[0-9]*$/).external(async value => {
        await duplicate('students', 'phone_number', value);
    }),
    enrollmentNumber: Joi.string().required().external(async value => {
        await duplicate('students', 'enrollment_number', value);
    }),
    departmentId: Joi.number().required().external(async value => {
        await exists('departments', 'id', value);
    }),
});

const loginStudent = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

module.exports = {
    createStudent,
    loginStudent,
}
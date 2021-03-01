const Joi = require('joi');

const { duplicate } = require('../utils/db');

const createAdmin = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required().external(async value => {
        await duplicate('admins', 'email', value);
    }),
    password: Joi.string().required(),
    phoneNumber: Joi.string().max(15).required().regex(/^[0-9]*$/).external(async value => {
        await duplicate('admins', 'phone_number', value);
    }),
});

const loginAdmin = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

module.exports = {
    createAdmin,
    loginAdmin,
}
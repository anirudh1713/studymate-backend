const Joi = require('joi');

const { exists } = require('../utils/db');

const createAssignment = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  subject: Joi.number().positive().external(async (value) => {
    await exists('subjects', 'id', value);
  }),
  faculty: Joi.number().positive().external(async (value) => {
    await exists('faculties', 'id', value);
  }),
});

module.exports = {
  createAssignment,
};

const Joi = require('joi');

const { exists } = require('../utils/db');

const createNotice = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  term: Joi.number().external(async (value) => {
    await exists('terms', 'id', value);
  }),
  department: Joi.number().external(async (value) => {
    await exists('departments', 'id', value);
  }),
});

module.exports = {
  createNotice,
};

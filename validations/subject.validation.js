const Joi = require('joi');
const { ValidationError } = require('joi');
const knex = require('../db/db');

const { duplicate, exists } = require('../utils/db');

const createSubject = Joi.object({
  name: Joi.string().required().trim(),
  code: Joi.string().required().external(async (value) => {
    await duplicate('subjects', 'code', value);
  }),
  term: Joi.number().required().positive().external(async (value) => {
    await exists('terms', 'id', value);
  }),
  faculties: Joi.array().items(
    Joi.object({
      id: Joi.number().required(),
    }).unknown(),
  ).external(async (value) => {
    if (value && value.length >= 1) {
      for (const faculty of value) {
        const fac = await knex('faculties').select('*').where({
          id: faculty.id,
        });
        if (fac.length !== 1) {
          throw new ValidationError(`Faculty with id ${faculty.facultyId} either does not exist.`);
        }
      }
    }
  }),
});

module.exports = {
  createSubject,
};

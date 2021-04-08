const Joi = require('joi');
const { ValidationError } = require('joi');

const knex = require('../db/db');
const { duplicate } = require('../utils/db');

const createDepartment = Joi.object({
  name: Joi.string().required(),
  terms: Joi.number().positive().required(),
  code: Joi.number().required().external(async (value) => {
    await duplicate('departments', 'code', value);
  }),
  tutionFee: Joi.number().required(),
  faculties: Joi.array().items(
    Joi.object({
      facultyId: Joi.number().required(),
    }).unknown(),
  ).external(async (value) => {
    if (value && value.length >= 1) {
      for (const faculty of value) {
        const fac = await knex('faculties').select('*').where({
          id: faculty.facultyId,
          department_id: null,
        });
        if (fac.length !== 1) {
          throw new ValidationError(`Faculty with id ${faculty.facultyId} either does not exist or is already asociated with another department.`);
        }
      }
    }
  }),
});

module.exports = {
  createDepartment,
};

const Joi = require('joi');
const { ValidationError } = require('joi');

const knex = require('../db/db');
const { duplicate, exists } = require('../utils/db');

const createDepartment = Joi.object({
  name: Joi.string().required(),
  terms: Joi.number().positive().required(),
  code: Joi.number().required().external(async (value) => {
    await duplicate('departments', 'code', value);
  }),
  tutionFee: Joi.number().positive().required(),
  faculties: Joi.array().items(
    Joi.object({
      id: Joi.number().required(),
    }).unknown(),
  ).external(async (value) => {
    if (value && value.length >= 1) {
      for (const faculty of value) {
        const fac = await knex('faculties').select('*').where({
          id: faculty.id,
          department_id: null,
        });
        if (fac.length !== 1) {
          throw new ValidationError(`Faculty with id ${faculty.facultyId} either does not exist or is already asociated with another department.`);
        }
      }
    }
  }),
});

const editDepartment = Joi.object({
  name: Joi.string().required(),
  code: Joi.number().positive().required().external(async (value) => {
    await duplicate('departments', 'code', value);
  }),
  tutionFee: Joi.number().positive().required(),
  id: Joi.number().positive().required().external(async (value) => {
    await exists('departments', 'id', value);
  }),
});

module.exports = {
  createDepartment,
  editDepartment,
};

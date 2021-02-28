const knex = require('../db/db');

const apiResponses = require('../utils/apiResponses');

const validate = (schema, arr) => async (req, res, next) => {
  try {
    const { value, error } = schema.validate(req.body);

    if (error) {
      return apiResponses.errorResponse(res, error.message, 400);
    }

    for (const item of arr) {
      const data = await knex(item.table).where({ [item.prop]: req.body[item.prop] }).select('*');
      if (data.length >= 1) {
        return apiResponses.errorResponse(res, `${item.prop} already in use.`, 400);
      }
    }
    next();
  } catch (error) {
    return apiResponses.errorResponse(res, error.message, 500);
  }
};

module.exports = validate;
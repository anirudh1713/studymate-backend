const { ValidationError } = require('Joi');

const apiResponses = require('../utils/apiResponses');

const validate = (schema) => async (req, res, next) => {
  try {
    const { value, error } = await schema.validateAsync(req.body);
    if (error) {
      return apiResponses.errorResponse(res, error.message, 400);
    }

    next();
  } catch (error) {
    if (error instanceof ValidationError) {
      return apiResponses.errorResponse(res, error.message, 400);
    }
    return apiResponses.errorResponse(res, error.message, 500);
  }
};

module.exports = validate;
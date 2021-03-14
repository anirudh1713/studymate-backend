const { isError } = require('joi');

const apiResponses = require('../utils/apiResponses');

const validate = (schema) => async (req, res, next) => {
  try {
    const { error } = await schema.validateAsync(req.body);
    if (error) {
      return apiResponses.errorResponse(res, error.message, 400);
    }

    return next();
  } catch (error) {
    if (isError(error) || error.name === 'ValidationError') {
      return apiResponses.errorResponse(res, error.message, 400);
    }
    return apiResponses.errorResponse(res, error.message, 500);
  }
};

module.exports = validate;

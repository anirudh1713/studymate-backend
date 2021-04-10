const knex = require('../db/db');
const apiResponses = require('../utils/apiResponses');

const getTerms = async (req, res) => {
  try {
    const termId = req.params.id;
    if (termId.isNaN) return apiResponses.errorResponse(res, 'Invalid term', 400);

    let term = await knex('terms').select('*').where({ id: termId });
    if (term.length !== 1) return apiResponses.errorResponse(res, 'Term not found', 400);

    [term] = term;
    return apiResponses.successResponse(res, 'Successfully fetched term', { term }, 200);
  } catch (e) {
    return apiResponses.errorResponse(res, e.message, 500);
  }
};

const getTermsByDepartment = async (req, res) => {
  try {
    const departmentId = req.params.department;
    if (departmentId.isNaN) return apiResponses.errorResponse(res, 'Invalid department', 400);

    const terms = await knex('terms').select('*').where({ department_id: departmentId });
    if (!terms.length > 0) return apiResponses.errorResponse(res, 'Terms not found', 400);

    return apiResponses.successResponse(res, 'Successfully fetched terms', { terms }, 200);
  } catch (e) {
    return apiResponses.errorResponse(res, e.message, 500);
  }
};

module.exports = {
  getTerms,
  getTermsByDepartment,
};

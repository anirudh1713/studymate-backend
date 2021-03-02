const apiResponses = require('../utils/apiResponses');
const knex = require('../db/db');

const createDepartment = async (req, res) => {
    try {
      const { name, code, tutionFee } = req.body;
      let department = await knex('departments').insert({
        name,
        code,
        tution_fee: tutionFee,
      }).returning('*');
  
      if (department.length !== 1) {
        return apiResponses.errorResponse(res, 'Something went wrong.', 400);
      }
      department = department[0];
      
      return apiResponses.successResponse(res, 'Created department successfully.', { department }, 201);
    } catch (error) {
      apiResponses.errorResponse(res, error.message, 500);
    }
};

module.exports = {
    createDepartment,
}
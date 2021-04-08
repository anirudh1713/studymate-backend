const apiResponses = require('../utils/apiResponses');
const knex = require('../db/db');

const createDepartment = async (req, res) => {
  try {
    const {
      name, code, tutionFee, faculties, terms,
    } = req.body;
    let department = await knex('departments')
      .insert({
        name,
        code,
        tution_fee: tutionFee,
        terms,
      })
      .returning('*');

    if (department.length !== 1) {
      return apiResponses.errorResponse(res, 'Something went wrong.', 400);
    }
    [department] = department;

    const facultiesOfDept = [];
    if (faculties && faculties.length >= 1) {
      for (const faculty of faculties) {
        const fac = await knex('faculties')
          .update({ department_id: department.id })
          .where({ id: faculty.facultyId })
          .returning('*');
        if (fac.length !== 1) {
          await knex('departments').where({ id: department.id }).delete();
          return apiResponses.errorResponse(res, 'Failed to create and map faculties.', 500);
        }
        facultiesOfDept.push(fac[0]);
      }
    }

    if (facultiesOfDept.length >= 1) {
      department.faculties = facultiesOfDept;
    }

    return apiResponses.successResponse(res, 'Created department successfully.', { department }, 201);
  } catch (error) {
    return apiResponses.errorResponse(res, error.message, 500);
  }
};

const getDepartments = async (req, res) => {
  try {
    const departments = await knex('departments')
      .select('*');

    if (!departments.length >= 1) {
      return apiResponses.errorResponse(res, 'No departments found.', 404);
    }

    return apiResponses.successResponse(res, 'Departments found.', { departments }, 200);
  } catch (error) {
    return apiResponses.errorResponse(res, error.message, 500);
  }
};

module.exports = {
  createDepartment,
  getDepartments,
};

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

    const allTerms = department.terms;
    const allPromises = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= allTerms; i++) {
      const term = await knex('terms').insert({ name: `${i}`, department_id: department.id, duration: 6 });
      allPromises.push(term);
    }
    await Promise.all(allPromises);

    const facultiesOfDept = [];
    if (faculties && faculties.length >= 1) {
      for (const faculty of faculties) {
        const fac = await knex('faculties')
          .update({ department_id: department.id })
          .where({ id: faculty.id })
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

const deleteDepartment = async (req, res) => {
  try {
    const departmentId = req.query.department;
    if (departmentId.isNaN) return apiResponses.errorResponse(res, 'Invalid id provided.', 400);

    let deletedDepartment = await knex('departments').where({ id: departmentId }).del().returning('*');
    if (deletedDepartment.length !== 1) return apiResponses.errorResponse(res, 'Could not delete department', 400);

    [deletedDepartment] = deletedDepartment;
    return apiResponses.successResponse(res, 'Successfully deleted department', { department: deletedDepartment }, 200);
  } catch (error) {
    return apiResponses.errorResponse(res, error.message, 500);
  }
};

const editDepartment = async (req, res) => {
  try {
    const {
      id, name, code, tutionFee,
    } = req.body;

    let updatedDepartment = await knex('departments').where('id', '=', id).update({ name, code, tution_fee: tutionFee }).returning('*');
    if (updatedDepartment.length !== 1) return apiResponses.errorResponse(res, 'Could not update department', 400);

    [updatedDepartment] = updatedDepartment;
    return apiResponses.successResponse(res, 'successfully updated department', { department: updatedDepartment }, 200);
  } catch (error) {
    return apiResponses.errorResponse(res, error.message, 500);
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  deleteDepartment,
  editDepartment,
};

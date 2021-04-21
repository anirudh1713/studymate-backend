const apiResponses = require('../utils/apiResponses');
const knex = require('../db/db');

const createAssignment = async (req, res) => {
  try {
    const {
      title, description, subject, faculty,
    } = req.body;

    let assignment = await knex('assignments')
      .insert({
        title, description, subject_id: subject, faculty_id: faculty,
      })
      .returning('*');
    if (assignment.length !== 1) return apiResponses.errorResponse(res, 'Something went wrong', 500);

    [assignment] = assignment;
    return apiResponses.successResponse(res, 'Successfully added assignment', { assignment }, 201);
  } catch (error) {
    return apiResponses.errorResponse(res, error.message, 500);
  }
};

const deleteAssignemnt = async (req, res) => {
  try {
    const assignmentId = req.query.assignment;
    if (assignmentId.isNaN) return apiResponses.errorResponse(res, 'Invalid assignment id', 400);

    let assignment = await knex('assignments')
      .where('id', '=', assignmentId)
      .del()
      .returning('*');
    if (assignment.length !== 1) return apiResponses.errorResponse(res, 'Something went wrong', 500);

    [assignment] = assignment;
    return apiResponses.successResponse(res, 'Successfully deleted assignemtn', { assignment }, 200);
  } catch (error) {
    return apiResponses.errorResponse(res, error.message, 500);
  }
};

const getAssignment = async (req, res) => {
  try {
    const facultyId = req.query.faculty;
    const termId = req.query.term;

    let assignments = await knex('assignments')
      .select('*');

    if (facultyId) {
      assignments = await knex('assignments')
        .select('*')
        .where('faculty_id', '=', facultyId);
    }
    if (termId) {
      let subjects = await knex('subjects').select('id').where('term_id', '=', termId);
      subjects = subjects.map((item) => item.id);
      assignments = await knex('assignments')
        .select('*')
        .whereIn('subject_id', subjects);
    }

    return apiResponses.successResponse(res, 'successfully fetched assignements', { assignments }, 200);
  } catch (error) {
    return apiResponses.errorResponse(res, error.message, 500);
  }
};

module.exports = {
  createAssignment,
  deleteAssignemnt,
  getAssignment,
};

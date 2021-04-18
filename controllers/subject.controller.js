const knex = require('../db/db');
const apiResponses = require('../utils/apiResponses');

const createSubject = async (req, res) => {
  try {
    const {
      name, code, term, faculties = [],
    } = req.body;

    let subject = await knex('subjects')
      .insert({ name, code, term_id: term })
      .returning('*');

    if (subject.length !== 1) return apiResponses.errorResponse(res, 'Could not create subject', 500);

    [subject] = subject;
    const subjectFacultyData = faculties.map((faculty) => (
      { faculty_id: faculty.id, subject_id: subject.id }
    ));

    await knex('subject_faculty')
      .insert(subjectFacultyData);
    return apiResponses.successResponse(res, 'Successfully created subject', { subject }, 201);
  } catch (error) {
    return apiResponses.errorResponse(res, error.message, 500);
  }
};

module.exports = {
  createSubject,
};

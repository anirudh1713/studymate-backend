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

const getSubjects = async (req, res) => {
  try {
    const { faculty, term } = req.query;
    let subjects = await knex('subjects')
      .select('*');
    if (faculty) {
      subjects = await knex('subject_faculty')
        .select('*')
        .modify((queryBuilder) => {
          if (faculty) {
            queryBuilder
              .where('faculty_id', '=', faculty)
              .join('subjects', 'subject_faculty.subject_id', 'subjects.id');
          }
        });
    }
    if (term) {
      subjects = await knex('subjects')
        .select('*')
        .modify((queryBuilder) => {
          if (term) {
            queryBuilder
              .where('term_id', '=', term);
          }
        });
    }
    return apiResponses.successResponse(res, 'Successfully fetched subjects', { subjects }, 200);
  } catch (error) {
    return apiResponses.errorResponse(res, error.message, 500);
  }
};

const deleteSubject = async (req, res) => {
  try {
    const subjectId = req.query.subject;
    if (subjectId.isNaN) return apiResponses.errorResponse(res, 'Invalid id provided.', 400);

    let subject = await knex('subjects')
      .where('id', '=', subjectId)
      .del()
      .returning('*');
    if (subject.length !== 1) return apiResponses.errorResponse(res, 'Something went wrong', 500);

    [subject] = subject;
    return apiResponses.successResponse(res, 'Successfully deleted subject.', { subject }, 200);
  } catch (error) {
    return apiResponses.errorResponse(res, error.message, 500);
  }
};

module.exports = {
  createSubject,
  getSubjects,
  deleteSubject,
};

const knex = require('../db/db');
const apiResponses = require('../utils/apiResponses');

const createNotice = async (req, res) => {
  try {
    const {
      title, description, term, department,
    } = req.body;

    let notice = await knex('notice').insert({
      title, description, term_id: term, department_id: department,
    }).returning('*');
    if (notice.length !== 1) return apiResponses.errorResponse(res, 'notice not created.', 400);

    [notice] = notice;
    return apiResponses.successResponse(res, 'Successfully created notice', { notice }, 201);
  } catch (error) {
    return apiResponses.errorResponse(res, 'Something went wrong.', 500);
  }
};

const getNotices = async (req, res) => {
  try {
    const notices = await knex('notice').join('departments', 'notice.department_id', '=', 'departments.id').select('notice.*', 'departments.name');
    if (!notices.length >= 1) return apiResponses.errorResponse(res, 'No notices found.', 404);

    return apiResponses.successResponse(res, 'Successfully fetched notices', { notices }, 200);
  } catch (error) {
    return apiResponses.errorResponse(res, error.message || 'Something went wrong.', 500);
  }
};

const deleteNotices = async (req, res) => {
  try {
    const noticeId = req.query.notice;
    if (noticeId.isNaN) return apiResponses.errorResponse(res, 'Invalid notice id passed.', 400);

    let notice = await knex('notice').where('id', '=', noticeId).del().returning('*');
    if (notice.length !== 1) return apiResponses.errorResponse(res, 'something went wrong.', 500);

    [notice] = notice;
    return apiResponses.successResponse(res, 'Successfully deleted notice.', { notice }, 200);
  } catch (error) {
    return apiResponses.errorResponse(res, 'Something went wrong', 500);
  }
};

module.exports = {
  createNotice,
  getNotices,
  deleteNotices,
};

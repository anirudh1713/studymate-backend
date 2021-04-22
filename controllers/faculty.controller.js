const bcrypt = require('bcrypt');
const generator = require('generate-password');

const apiResponses = require('../utils/apiResponses');
const {
  generateAccessToken,
  generateRefreshToken,
  matchPassword,
} = require('../utils/auth');
const sendEmail = require('../mailer');
const ROLES = require('../ROLES');
const knex = require('../db/db');

const createFaculty = async (req, res) => {
  try {
    const {
      name, email, phoneNumber, departmentId,
    } = req.body;

    const password = generator.generate({
      length: 10,
      numbers: true,
    });
    const encryptedPassword = await bcrypt.hash(password, 10);

    const facultyToCreate = {
      name,
      email,
      password: encryptedPassword,
      phone_number: phoneNumber,
    };

    if (departmentId) {
      facultyToCreate.department_id = departmentId;
    }

    // Create new faculty
    let faculty = await knex('faculties').insert(facultyToCreate).returning('*');

    // If nothing returned from query
    if (faculty.length !== 1) {
      return apiResponses.errorResponse(res, 'Something went wrong.', 400);
    }
    [faculty] = faculty;

    // Generate access & refresh token
    const accessToken = generateAccessToken(faculty.id, ROLES.faculty);
    const refreshToken = generateRefreshToken(faculty.id, ROLES.faculty);

    // Data to be reutrned
    const data = {
      faculty,
      access_token: accessToken,
      refresh_token: refreshToken,
    };

    await sendEmail(faculty.email, `Your StudyMate password is ${password}`);

    return apiResponses.successResponse(res, 'Faculty created.', data, 201);
  } catch (error) {
    return apiResponses.errorResponse(res, error.message, 500);
  }
};

const loginFaculty = async (req, res) => {
  try {
    const { email, password } = req.body;
    let faculty = await knex('faculties').where({ email }).select('*');

    // No faculty found
    if (faculty.length !== 1) {
      return apiResponses.errorResponse(res, 'Invalid credentials.', 400);
    }
    [faculty] = faculty;

    // Match password
    const isValid = await matchPassword(password, faculty.password);
    if (!isValid) {
      return apiResponses.errorResponse(res, 'Invalid credentials', 400);
    }

    const accessToken = generateAccessToken(faculty.id, ROLES.faculty);
    const refreshToken = generateRefreshToken(faculty.id, ROLES.faculty);

    const data = {
      faculty,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
    return apiResponses.successResponse(res, 'Successfully loggedin.', data, 200);
  } catch (error) {
    return apiResponses.errorResponse(res, error.message, 500);
  }
};

const getUnassignedFaculty = async (req, res) => {
  try {
    const faculties = await knex('faculties').select('*').where({ department_id: null });
    if (!faculties.length >= 1) {
      return apiResponses.errorResponse(res, 'No faculties without department.', 400);
    }
    return apiResponses.successResponse(res, 'Faculties found.', { faculties }, 200);
  } catch (error) {
    return apiResponses.errorResponse(res, error.message, 500);
  }
};

const getFaculties = async (req, res) => {
  try {
    const faculties = await knex('faculties').select('*');
    if (!faculties.length >= 1) return apiResponses.errorResponse(res, 'No faculties found', 404);

    return apiResponses.successResponse(res, 'Found faculties', { faculties }, 200);
  } catch (error) {
    return apiResponses.errorResponse(res, error.message, 500);
  }
};

const deleteFaculty = async (req, res) => {
  try {
    const facultyId = req.query.faculty;
    if (facultyId.isNaN) return apiResponses.errorResponse(res, 'invalid faculty id.', 400);

    let deletedFaculty = await knex('faculties').where('id', '=', facultyId).del().returning('*');
    if (deletedFaculty.length !== 1) return apiResponses.errorResponse(res, 'something went wrong', 400);

    [deletedFaculty] = deletedFaculty;
    return apiResponses.successResponse(res, 'Deleted faculty.', { faculty: deletedFaculty }, 200);
  } catch (error) {
    return apiResponses.errorResponse(res, error.message, 500);
  }
};

module.exports = {
  createFaculty,
  loginFaculty,
  getUnassignedFaculty,
  getFaculties,
  deleteFaculty,
};

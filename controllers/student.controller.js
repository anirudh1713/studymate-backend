const bcrypt = require('bcrypt');

const apiResponses = require('../utils/apiResponses');
const {
  generateAccessToken,
  generateRefreshToken,
  matchPassword,
} = require('../utils/auth');
const ROLES = require('../ROLES');
const knex = require('../db/db');

const createStudent = async (req, res) => {
  try {
    const {
      name, email, phoneNumber, enrollmentNumber, departmentId,
    } = req.body;

    // TODO - auto generate password and send to student email.
    let password = '112233';
    password = await bcrypt.hash(password, 10);

    let student = await knex('students').insert({
      name,
      email,
      phone_number: phoneNumber,
      password,
      enrollment_number: enrollmentNumber,
      department_id: departmentId,
    }).returning('*');

    if (student.length !== 1) {
      return apiResponses.errorResponse(res, 'Something went wrong.', 400);
    }
    [student] = student;

    // Generate access & refresh token
    const accessToken = generateAccessToken(student.id, ROLES.student);
    const refreshToken = generateRefreshToken(student.id, ROLES.student);

    // Data to be returned
    const data = {
      student,
      access_token: accessToken,
      refresh_token: refreshToken,
    };

    return apiResponses.successResponse(res, 'Student created.', data, 201);
  } catch (error) {
    return apiResponses.errorResponse(res, error.message, 500);
  }
};

const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    let student = await knex('students').where({ email }).select('*');
    if (student.length !== 1) {
      return apiResponses.errorResponse(res, 'Invalid credentials.', 400);
    }
    [student] = student;

    const isValid = await matchPassword(password, student.password);
    if (!isValid) {
      return apiResponses.errorResponse(res, 'Invalid credentials.', 400);
    }

    // Generate access & refresh token
    const accessToken = generateAccessToken(student.id, ROLES.student);
    const refreshToken = generateRefreshToken(student.id, ROLES.student);

    const data = {
      student,
      access_token: accessToken,
      refresh_token: refreshToken,
    };

    return apiResponses.successResponse(res, 'Loggedin successfully.', data, 200);
  } catch (error) {
    return apiResponses.errorResponse(res, error.message, 500);
  }
};

module.exports = {
  createStudent,
  loginStudent,
};

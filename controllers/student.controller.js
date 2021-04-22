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

const createStudent = async (req, res) => {
  try {
    const {
      name, email, phoneNumber, enrollmentNumber, departmentId, termId,
    } = req.body;

    const password = generator.generate({
      length: 10,
      numbers: true,
    });
    const hashedPassword = await bcrypt.hash(password, 10);

    let student = await knex('students').insert({
      name,
      email,
      phone_number: phoneNumber,
      password: hashedPassword,
      enrollment_number: enrollmentNumber,
      department_id: departmentId,
      term_id: termId,
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

    await sendEmail(student.email, `Your StudyMate password is ${password}`);

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

const getStudents = async (req, res) => {
  try {
    const students = await knex('students').select('*');
    if (!students.length >= 1) return apiResponses.errorResponse(res, 'No students found', 404);

    return apiResponses.successResponse(res, 'Successfully fetched students', { students }, 200);
  } catch (error) {
    return apiResponses.errorResponse(res, error.message, 500);
  }
};

const deleteStudents = async (req, res) => {
  try {
    const studentId = req.query.student;
    if (studentId.isNaN) return apiResponses.errorResponse(res, 'Invalid student id.', 400);

    let deletedStudent = await knex('students').where('id', '=', studentId).del().returning('*');
    if (deletedStudent.length !== 1) return apiResponses.errorResponse(res, 'Something went wrong.', 400);

    [deletedStudent] = deletedStudent;
    return apiResponses.successResponse(res, 'Deleted student.', { student: deleteStudents }, 200);
  } catch (error) {
    return apiResponses.errorResponse(res, error.message, 500);
  }
};
module.exports = {
  createStudent,
  loginStudent,
  getStudents,
  deleteStudents,
};

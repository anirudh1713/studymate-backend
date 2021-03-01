const bcrypt = require('bcrypt');

const apiResponses = require('../utils/apiResponses');
const {
  generateAccessToken, 
  generateRefreshToken,
  matchPassword,
} = require('../utils/auth');
const ROLES = require('../ROLES');
const knex = require('../db/db');


const createAdmin = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);

    //Create new admin
    let admin = await knex('admins').insert({
      name,
      email,
      password: encryptedPassword,
      phone_number: phoneNumber,
    }).returning('*');

    //If nothing returned from query
    if (admin.length !== 1) {
      return apiResponses.errorResponse(res, 'Something went wrong.', 400);
    }
    admin = admin[0];

    //Generate access & refresh token
    const accessToken = generateAccessToken(admin.id, ROLES.admin);
    const refreshToken = generateRefreshToken(admin.id, ROLES.admin);
    
    //Data to be reutrned
    const data = {
      admin, 
      accessToken, 
      refreshToken 
    };
    
    return apiResponses.successResponse(res, 'Admin created.', data, 201);
  } catch (error) {
    apiResponses.errorResponse(res, error.message, 500);
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    let admin = await knex('admins').where({ email }).select('*');

    //No admin found
    if (admin.length !== 1) {
      return apiResponses.errorResponse(res, 'Invalid credentials.', 400);
    }
    admin = admin[0];

    //Match password
    const isValid = await matchPassword(password, admin.password);
    if (!isValid) {
      return apiResponses.errorResponse(res, 'Invalid credentials', 400);
    }

    const accessToken = generateAccessToken(admin.id, ROLES.admin);
    const refreshToken = generateRefreshToken(admin.id, ROLES.admin);

    const data = {
      admin,
      accessToken,
      refreshToken,
    };
    return apiResponses.successResponse(res, 'Successfully loggedin.', data, 200);
  } catch (error) {
    apiResponses.errorResponse(res, error.message, 500);
  }
};

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

const createStudent = async (req, res) => {
  try {
    const {
      name, 
      email, 
      phoneNumber,
      enrollmentNumber, 
      departmentId 
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
    student = student[0];

    //Generate access & refresh token
    const accessToken = generateAccessToken(student.id, ROLES.student);
    const refreshToken = generateRefreshToken(student.id, ROLES.student);
    
    //Data to be reutrned
    const data = {
      student, 
      accessToken, 
      refreshToken 
    };
    
    return apiResponses.successResponse(res, 'Student created.', data, 201);
  } catch (error) {
    apiResponses.errorResponse(res, error.message, 500);
  }
};

const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    let student = await knex('students').where({ email }).select('*');
    if (student.length !== 1) {
      return apiResponses.errorResponse(res, 'Invalid credentials.', 400);
    }
    student = student[0];

    const isValid = await matchPassword(password, student.password);
    if (!isValid) {
      return apiResponses.errorResponse(res, 'Invalid credentials.', 400);
    }

    //Generate access & refresh token
    const accessToken = generateAccessToken(student.id, ROLES.student);
    const refreshToken = generateRefreshToken(student.id, ROLES.student);

    const data = {
      student,
      accessToken,
      refreshToken,
    };

    return apiResponses.successResponse(res, 'Loggedin successfully.', data, 200);
  } catch (error) {
    apiResponses.errorResponse(res, error.message, 500);
  }
};

module.exports = {  
  createAdmin,
  loginAdmin,
  createDepartment,
  createStudent,
  loginStudent,
}
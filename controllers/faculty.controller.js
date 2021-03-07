const bcrypt = require('bcrypt');

const apiResponses = require('../utils/apiResponses');
const {
  generateAccessToken, 
  generateRefreshToken,
  matchPassword,
} = require('../utils/auth');
const ROLES = require('../ROLES');
const knex = require('../db/db');

const createFaculty = async (req, res) => {
    try {
      const { name, email, phoneNumber, departmentId } = req.body;
  
      // TODO - auto generate password and send to faculty email
      const password = '112233';
      const encryptedPassword = await bcrypt.hash(password, 10);

      let facultyToCreate = {
        name,
        email,
        password: encryptedPassword,
        phone_number: phoneNumber,
      };

      if (departmentId) {
        facultyToCreate.department_id = departmentId;
      }

      //Create new faculty
      let faculty = await knex('faculties').insert(facultyToCreate).returning('*');
  
      //If nothing returned from query
      if (faculty.length !== 1) {
        return apiResponses.errorResponse(res, 'Something went wrong.', 400);
      }
      faculty = faculty[0];
  
      //Generate access & refresh token
      const accessToken = generateAccessToken(faculty.id, ROLES.faculty);
      const refreshToken = generateRefreshToken(faculty.id, ROLES.faculty);
      
      //Data to be reutrned
      const data = {
        faculty, 
        accessToken, 
        refreshToken 
      };
      
      return apiResponses.successResponse(res, 'Faculty created.', data, 201);
    } catch (error) {
      apiResponses.errorResponse(res, error.message, 500);
    }
  };
  
const loginFaculty = async (req, res) => {
    try {
      const { email, password } = req.body;
      let faculty = await knex('faculties').where({ email }).select('*');
  
      //No faculty found
      if (faculty.length !== 1) {
        return apiResponses.errorResponse(res, 'Invalid credentials.', 400);
      }
      faculty = faculty[0];
  
      //Match password
      const isValid = await matchPassword(password, faculty.password);
      if (!isValid) {
        return apiResponses.errorResponse(res, 'Invalid credentials', 400);
      }
  
      const accessToken = generateAccessToken(faculty.id, ROLES.faculty);
      const refreshToken = generateRefreshToken(faculty.id, ROLES.faculty);
  
      const data = {
        faculty,
        accessToken,
        refreshToken,
      };
      return apiResponses.successResponse(res, 'Successfully loggedin.', data, 200);
    } catch (error) {
      apiResponses.errorResponse(res, error.message, 500);
    }
};

const getUnassignedFaculty = async (req, res) => {
  try {
    const faculties = await knex('faculties').select('*').where({ department_id: null });
    if (!faculties.length >= 1) {
      return apiResponses.errorResponse(res, 'No faculties without department.', 400);
    }
    apiResponses.successResponse(res, 'Faculties found.', 200);
  } catch (error) {
    apiResponses.errorResponse(res, error.message, 500);
  }
}
  
module.exports = {  
    createFaculty,
    loginFaculty,
    getUnassignedFaculty,
}
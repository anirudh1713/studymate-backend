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
    const {
      name, email, phoneNumber, password,
    } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    let admin = await knex('admins').insert({
      name,
      email,
      password: encryptedPassword,
      phone_number: phoneNumber,
    }).returning('*');

    // If nothing returned from query
    if (admin.length !== 1) {
      return apiResponses.errorResponse(res, 'Something went wrong.', 400);
    }
    [admin] = admin;

    // Generate access & refresh token
    const accessToken = generateAccessToken(admin.id, ROLES.admin);
    const refreshToken = generateRefreshToken(admin.id, ROLES.admin);

    // Data to be returned
    const data = {
      admin,
      accessToken,
      refreshToken,
    };

    return apiResponses.successResponse(res, 'Admin created.', data, 201);
  } catch (error) {
    return apiResponses.errorResponse(res, error.message, 500);
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    let admin = await knex('admins').where({ email }).select('*');

    // No admin found
    if (admin.length !== 1) {
      return apiResponses.errorResponse(res, 'Invalid credentials.', 400);
    }
    [admin] = admin;

    // Match password
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
    return apiResponses.errorResponse(res, error.message, 500);
  }
};

module.exports = {
  createAdmin,
  loginAdmin,
};

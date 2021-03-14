const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateAccessToken = (id, role) => jwt.sign({
  id,
  role,
}, process.env.ACCESS_TOKEN_SECRET, {
  expiresIn: '3d',
});

const generateRefreshToken = (id, role) => jwt.sign({
  id,
  role,
}, process.env.REFRESH_TOKEN_SECRET, {
  expiresIn: '20d',
});

const matchPassword = async (password, hashedPassword) => bcrypt.compare(password, hashedPassword);

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  matchPassword,
};

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateAccessToken = (id, role) => {
    const accessToken = jwt.sign({
        id,
        role,
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '3d',
    });
    return accessToken;
};

const generateRefreshToken = (id, role) => {
    const refreshToken = jwt.sign({
        id,
        role,
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '20d',
    });
    return refreshToken;
};

const matchPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    matchPassword,
}
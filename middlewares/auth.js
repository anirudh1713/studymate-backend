const jwt = require('jsonwebtoken');
const { JsonWebTokenError, TokenExpiredError } = require('jsonwebtoken');

const knex = require('../db/db');
const apiResponses = require('../utils/apiResponses');
const ROLES = require('../ROLES');

const auth = (role) => async (req, res,next) => {
    try {
        if (!req.headers.authorization) {
            return apiResponses.errorResponse(res, 'Not authorized.', 400);
        }
        const token = req.headers.authorization.split(' ')[1];
        const payLoad = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const isValid = payLoad.role === role;
        if (!isValid) {
            return apiResponses.errorResponse(res, 'Forbidden', 403);
        }

        let user = [];
        if (role === ROLES.admin) {
            user = await knex('admins').select('*').where({ id: payLoad.id });
        } else if (role === ROLES.student) {
            user = await knex('students').select('*').where({ id: payLoad.id });
        } else if (role === ROLES.faculty) {
            user = await knex('faculties').select('*').where({ id: payLoad.id });
        }
        if (user.length !== 1) {
            return apiResponses.errorResponse(res, 'Not authorized.', 400);
        }
        
        req.user = user[0];
        next();
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            return apiResponses.errorResponse(res, error.message, 400);    
        } else if (error instanceof TokenExpiredError) {
            return apiResponses.errorResponse(res ,error.message, 400);
        }
        apiResponses.errorResponse(res, error.message, 500);
    }
};

module.exports = auth;
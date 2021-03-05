const request = require('supertest');
const sinon = require('sinon');

const knex = require('../db/db');
let app;
let auth;

const DEPARTMENT_ROUTE = '/api/v1/department';

beforeAll(async (done) => {
    await knex('departments').delete();
    auth = require('../middlewares/auth');
    sinon.stub(auth, "auth").callsFake((role) => (req, res, next) => {
        return next();
    });
    app = require('../app');
    done();
});

afterAll(async (done) => {
    await knex.destroy();
    sinon.restore();
    done();
});

describe('Test department endpoints', () => {
    it('should create department', async (done) => {
        const res = await request(app).post(`${DEPARTMENT_ROUTE}/`).send({
            name: "civil",
            code: 50,
            tutionFee: 32500,
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe(1);
        done();
    });

    it('should fail to create department(same code)', async (done) => {
        const res = await request(app).post(`${DEPARTMENT_ROUTE}/`).send({
            name: "CSE",
            code: 50,
            tutionFee: 32500,
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe(0);
        done();
    });
});
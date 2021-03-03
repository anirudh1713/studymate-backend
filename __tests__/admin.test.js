const request = require('supertest');

const knex = require('../db/db');
const app = require('../app');

const ADMIN_ROUTE = '/api/v1/admin';

beforeAll(async (done) => {
    await knex('admins').delete();
    done();
});

afterAll(async (done) => {
    await knex.destroy();
    done();
});

describe('Test admin endpoints', () => {
    it('should register admin', async (done) => {
        const res = await request(app).post(`${ADMIN_ROUTE}/signup`).send({
            email: "ani@ani.com",
            name: "anirudh",
            password: "123",
            phoneNumber: "1234567891",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe(1);
        done();
    });

    it('should fail admin registration (email in use)', async (done) => {
        const res = await request(app).post(`${ADMIN_ROUTE}/signup`).send({
            email: "ani@ani.com",
            name: "anirudh",
            password: "123",
            phoneNumber: "1234567890",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe(0);
        done();
    });

    it('should fail admin registration (phone in use)', async (done) => {
        const res = await request(app).post(`${ADMIN_ROUTE}/signup`).send({
            email: "anirudh@ani.com",
            name: "anirudh",
            password: "123",
            phoneNumber: "1234567891",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe(0);
        done();
    });

    it('should login successfully', async (done) => {
        const res = await request(app).post(`${ADMIN_ROUTE}/login`).send({
            email: "ani@ani.com",
            password: "123",
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(1);
        expect(res.body.data).toHaveProperty('accessToken');
        expect(res.body.data).toHaveProperty('refreshToken');
        done();
    });

    it('should fail login(invalid email)', async (done) => {
        const res = await request(app).post(`${ADMIN_ROUTE}/login`).send({
            email: "abc@ani.com",
            password: "123",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe(0);
        done();
    });

    it('should fail login(invalid password)', async (done) => {
        const res = await request(app).post(`${ADMIN_ROUTE}/login`).send({
            email: "ani@ani.com",
            password: "InvalidPassword",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe(0);
        done();
    });
});
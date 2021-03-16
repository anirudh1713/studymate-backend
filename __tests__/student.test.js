const sinon = require('sinon');
const request = require('supertest');

const knex = require('../db/db');

let app;
let auth;

const STUDENT_ROUTE = '/api/v1/student';

let id = 0;

beforeAll(async (done) => {
  await knex('students').delete();
  await knex('departments').delete();
  const dept = await knex('departments').insert({
    name: 'civil',
    code: 51,
    tution_fee: 32500,
  }).returning('*');
  id = dept[0].id;
  auth = require('../middlewares/auth');
  sinon.stub(auth, 'auth').callsFake(() => (req, res, next) => next());
  app = require('../app');
  done();
});

afterAll(async (done) => {
  await knex.destroy();
  sinon.restore();
  done();
});

describe('Test student endpoints', () => {
  it('should register student', async (done) => {
    const res = await request(app).post(`${STUDENT_ROUTE}/signup`).send({
      email: 'ani@ani.com',
      name: 'anirudh',
      phoneNumber: '1234567891',
      enrollmentNumber: '02',
      departmentId: id,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(1);
    done();
  });

  it('should fail student registration (email in use)', async (done) => {
    const res = await request(app).post(`${STUDENT_ROUTE}/signup`).send({
      email: 'ani@ani.com',
      name: 'anirudh',
      phoneNumber: '1234567890',
      enrollmentNumber: '03',
      departmentId: id,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(0);
    done();
  });

  it('should fail student registration (phone in use)', async (done) => {
    const res = await request(app).post(`${STUDENT_ROUTE}/signup`).send({
      email: 'anirudh@ani.com',
      name: 'anirudh',
      phoneNumber: '1234567891',
      enrollmentNumber: '04',
      departmentId: id,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(0);
    done();
  });

  it('should fail student registration (department does not exists)', async (done) => {
    const res = await request(app).post(`${STUDENT_ROUTE}/signup`).send({
      email: 'anirudh@ani.com',
      name: 'anirudh',
      phoneNumber: '1234567890',
      enrollmentNumber: '05',
      departmentId: 0,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(0);
    done();
  });

  it('should fail student registration (enrollmentNumber already in use)', async (done) => {
    const res = await request(app).post(`${STUDENT_ROUTE}/signup`).send({
      email: 'anirudh@ani.com',
      name: 'anirudh',
      phoneNumber: '1234567890',
      enrollmentNumber: '02',
      departmentId: id,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(0);
    done();
  });

  it('should login successfully', async (done) => {
    const res = await request(app).post(`${STUDENT_ROUTE}/login`).send({
      email: 'ani@ani.com',
      password: '112233',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(1);
    expect(res.body.data).toHaveProperty('access_token');
    expect(res.body.data).toHaveProperty('refresh_token');
    done();
  });

  it('should fail login(invalid email)', async (done) => {
    const res = await request(app).post(`${STUDENT_ROUTE}/login`).send({
      email: 'abc@ani.com',
      password: '112233',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(0);
    done();
  });

  it('should fail login(invalid password)', async (done) => {
    const res = await request(app).post(`${STUDENT_ROUTE}/login`).send({
      email: 'ani@ani.com',
      password: 'InvalidPassword',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(0);
    done();
  });
});

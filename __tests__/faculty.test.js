const sinon = require('sinon');
const request = require('supertest');

const knex = require('../db/db');

let app;
let auth;

const FACULTY_ROUTE = '/api/v1/faculty';

let id = 0;

beforeAll(async (done) => {
  await knex('faculties').delete();
  await knex('departments').delete();
  const dept = await knex('departments').insert({
    name: 'civil',
    code: 52,
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

describe('Test faculty endpoints', () => {
  it('should register faculty', async (done) => {
    const res = await request(app).post(`${FACULTY_ROUTE}/signup`).send({
      email: 'ani@ani.com',
      name: 'anirudh',
      phoneNumber: '1234567891',
      departmentId: id,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe(1);
    done();
  });

  it('should fail faculty registration (email in use)', async (done) => {
    const res = await request(app).post(`${FACULTY_ROUTE}/signup`).send({
      email: 'ani@ani.com',
      name: 'anirudh',
      phoneNumber: '1234567890',
      departmentId: id,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(0);
    done();
  });

  it('should fail faculty registration (phone in use)', async (done) => {
    const res = await request(app).post(`${FACULTY_ROUTE}/signup`).send({
      email: 'anirudh@ani.com',
      name: 'anirudh',
      phoneNumber: '1234567891',
      departmentId: id,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(0);
    done();
  });

  it('should fail faculty registration (department does not exists)', async (done) => {
    const res = await request(app).post(`${FACULTY_ROUTE}/signup`).send({
      email: 'anirudh@ani.com',
      name: 'anirudh',
      phoneNumber: '1234567891',
      departmentId: 0,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(0);
    done();
  });

  it('should login successfully', async (done) => {
    const res = await request(app).post(`${FACULTY_ROUTE}/login`).send({
      email: 'ani@ani.com',
      password: '112233',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(1);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
    done();
  });

  it('should fail login(invalid email)', async (done) => {
    const res = await request(app).post(`${FACULTY_ROUTE}/login`).send({
      email: 'abc@ani.com',
      password: '112233',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(0);
    done();
  });

  it('should fail login(invalid password)', async (done) => {
    const res = await request(app).post(`${FACULTY_ROUTE}/login`).send({
      email: 'ani@ani.com',
      password: 'InvalidPassword',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(0);
    done();
  });
});

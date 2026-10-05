const request = require('supertest');
const app = require('../app');

describe('Auth Endpoints', () => {
  it('should return 400 if login credentials are not provided', async () => {
    const res = await request(app).post('/auth/login').send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 if register data is missing', async () => {
    const res = await request(app).post('/auth/register').send({});
    expect(res.statusCode).toEqual(400);
  });
});

const request = require('supertest');
const app = require('../app');

describe('App Setup', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/ruta-que-no-existe');
    expect(res.statusCode).toEqual(404);
  });
});

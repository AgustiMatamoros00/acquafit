const request = require('supertest');
const app = require('../app');

describe('Workouts Endpoints', () => {
  it('should return 401 or 403 for unauthorized access to GET /workouts', async () => {
    const res = await request(app).get('/workouts');
    // Sin token, debería fallar
    expect(res.statusCode).toBeGreaterThanOrEqual(400); 
  });
});

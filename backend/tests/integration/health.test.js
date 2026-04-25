const request = require('supertest');
const app = require('../../src/app');

describe('GET /health', () => {
  it('returns API health status', async () => {
    const response = await request(app).get('/health').expect(200);

    expect(response.body).toEqual({
      success: true,
      message: 'FoodDash API is running'
    });
  });
});

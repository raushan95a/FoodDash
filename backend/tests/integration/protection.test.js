const request = require('supertest');
const app = require('../../src/app');

describe('protected and validation routes', () => {
  it('blocks customer profile without a token', async () => {
    const response = await request(app).get('/api/customers/me').expect(401);
    expect(response.body.message).toBe('Authentication token is required');
  });

  it('validates customer registration payloads before hitting the database', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'not-an-email', password: 'short' })
      .expect(400);

    expect(response.body.message).toBe('Validation failed');
    expect(response.body.details.length).toBeGreaterThan(0);
  });

  it('validates restaurant owner login payloads before hitting the database', async () => {
    const response = await request(app)
      .post('/api/restaurant-owner/auth/login')
      .send({ email: 'bad-email' })
      .expect(400);

    expect(response.body.message).toBe('Validation failed');
  });

  it('blocks restaurant owner dashboard without a token', async () => {
    const response = await request(app).get('/api/restaurant-owner/dashboard').expect(401);
    expect(response.body.message).toBe('Authentication token is required');
  });

  it('blocks admin delivery agent management without a token', async () => {
    const response = await request(app).get('/api/admin/delivery-agents').expect(401);
    expect(response.body.message).toBe('Authentication token is required');
  });
});

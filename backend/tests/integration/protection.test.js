const request = require('supertest');
const app = require('../../src/app');
const { signToken } = require('../../src/utils/token');

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

  it('does not expose delivery agents publicly', async () => {
    const response = await request(app).get('/api/delivery-agents').expect(404);
    expect(response.body.message).toContain('Route not found');
  });

  it('does not expose public order status updates', async () => {
    const token = signToken({ sub: 1, role: 'customer', email: 'customer@example.com' });
    const response = await request(app)
      .patch('/api/orders/1/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'delivered' })
      .expect(404);

    expect(response.body.message).toContain('Route not found');
  });

  it('rejects non-customer tokens on customer-only APIs', async () => {
    const token = signToken({ sub: 1, role: 'admin', email: 'admin@example.com' });
    const response = await request(app)
      .get('/api/customers/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);

    expect(response.body.message).toBe('You do not have permission to access this resource');
  });

  it('does not expose public restaurant menu creation', async () => {
    const response = await request(app)
      .post('/api/restaurants/1/menu')
      .send({ item_name: 'Unsafe public item' })
      .expect(404);

    expect(response.body.message).toContain('Route not found');
  });
});

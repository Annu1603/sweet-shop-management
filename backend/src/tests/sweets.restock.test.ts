import request from 'supertest';
import app from '../server';
import { query } from '../config/database';

beforeEach(async () => {
  await query('DELETE FROM sweets');
});


describe('POST /api/sweets/:id/restock', () => {
  it('❌ fails for negative restock', async () => {
    const res = await request(app)
      .post('/api/sweets/1/restock')
      .set('Authorization', `Bearer adminToken`)
      .send({ quantity: -5 });

    expect(res.status).toBe(400);
  });

  it('❌ fails for zero restock', async () => {
    const res = await request(app)
      .post('/api/sweets/1/restock')
      .set('Authorization', `Bearer adminToken`)
      .send({ quantity: 0 });

    expect(res.status).toBe(400);
  });

  it('❌ non-admin cannot restock', async () => {
    const res = await request(app)
      .post('/api/sweets/1/restock')
      .set('Authorization', `Bearer userToken`)
      .send({ quantity: 10 });

    expect(res.status).toBe(403);
  });

  it('❌ fails without token', async () => {
    const res = await request(app)
      .post('/api/sweets/1/restock')
      .send({ quantity: 10 });

    expect(res.status).toBe(401);
  });
});

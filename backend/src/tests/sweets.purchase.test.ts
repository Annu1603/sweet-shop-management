import request from 'supertest';
import app from '../server';
import { query } from '../config/database';
import bcrypt from 'bcrypt';

let userToken: string;
let sweetId: number;

beforeAll(async () => {
  await query('TRUNCATE TABLE sweets RESTART IDENTITY CASCADE');
  await query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');

  const hashed = await bcrypt.hash('user123', 10);
  await query(
    'INSERT INTO users (email, password, is_admin) VALUES ($1,$2,$3)',
    ['user@test.com', hashed, false]
  );

  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'user@test.com', password: 'user123' });

  userToken = res.body.token;
});

beforeEach(async () => {
  await query('TRUNCATE TABLE sweets RESTART IDENTITY CASCADE');

  const sweetRes = await query(
    `INSERT INTO sweets (name, category, price, quantity)
     VALUES ($1,$2,$3,$4) RETURNING id`,
    ['Ladoo', 'Indian', 10, 5]
  );

  sweetId = sweetRes.rows[0].id;
});

describe('POST /api/sweets/:id/purchase', () => {
  it('❌ fails if quantity > stock', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 100 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Insufficient stock');
  });

  it('❌ fails for zero quantity', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 0 });

    expect(res.status).toBe(400);
  });

  it('❌ fails for invalid sweet', async () => {
    const res = await request(app)
      .post('/api/sweets/9999/purchase')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 1 });

    expect(res.status).toBe(404);
  });

  it('✅ succeeds when quantity == stock', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(200);
  });

  it('❌ fails without token', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .send({ quantity: 1 });

    expect(res.status).toBe(401);
  });
});

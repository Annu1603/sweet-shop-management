import request from 'supertest';
import app from '../server';
import { query } from '../config/database';
import bcrypt from 'bcrypt';

let adminToken: string;
let userToken: string;

// 🔥 UNIQUE emails to avoid parallel test collisions
const ADMIN_EMAIL = 'admin_delete@test.com';
const USER_EMAIL = 'user_delete@test.com';

beforeAll(async () => {
  // Clean only required tables
  await query('TRUNCATE TABLE sweets RESTART IDENTITY CASCADE');
  await query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');

  // create admin
  const adminHashed = await bcrypt.hash('admin123', 10);
  await query(
    'INSERT INTO users (email, password, is_admin) VALUES ($1,$2,$3)',
    [ADMIN_EMAIL, adminHashed, true]
  );

  // create normal user
  const userHashed = await bcrypt.hash('user123', 10);
  await query(
    'INSERT INTO users (email, password, is_admin) VALUES ($1,$2,$3)',
    [USER_EMAIL, userHashed, false]
  );

  // login admin
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: ADMIN_EMAIL,
      password: 'admin123'
    });

  adminToken = adminRes.body.token;

  // login user
  const userRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: USER_EMAIL,
      password: 'user123'
    });

  userToken = userRes.body.token;
});

describe('DELETE /api/sweets/:id', () => {
  it('✅ admin should delete sweet', async () => {
    const sweet = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Admin Sweet',
        price: 10,
        quantity: 5
      });

    const res = await request(app)
      .delete(`/api/sweets/${sweet.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
  });

  it('❌ user should not delete sweet', async () => {
    const sweet = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'User Sweet',
        price: 10,
        quantity: 5
      });

    const res = await request(app)
      .delete(`/api/sweets/${sweet.body.id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });

  it('❌ no token should fail', async () => {
    const res = await request(app).delete('/api/sweets/1');
    expect(res.status).toBe(401);
  });
});

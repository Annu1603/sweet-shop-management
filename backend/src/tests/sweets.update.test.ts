import request from 'supertest';
import app from '../server';
import { query } from '../config/database';
import bcrypt from 'bcrypt';

let adminToken: string;
let sweetId: number;

beforeAll(async () => {
  await query('TRUNCATE TABLE sweets RESTART IDENTITY CASCADE');
  await query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');

  const hashed = await bcrypt.hash('admin123', 10);
  await query(
    `INSERT INTO users (email, password, is_admin)
     VALUES ($1,$2,$3)`,
    ['admin@test.com', hashed, true]
  );

  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', password: 'admin123' });

  adminToken = res.body.token;

  const sweetRes = await query(
    `INSERT INTO sweets (name, category, price, quantity)
     VALUES ($1,$2,$3,$4) RETURNING id`,
    ['Ladoo', 'Indian', 10, 5]
  );

  sweetId = sweetRes.rows[0].id;
});

describe('PUT /api/sweets/:id', () => {
  it('✅ should update a sweet (admin)', async () => {
    const res = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Kaju Katli',
        category: 'Dry Fruit',
        price: 25,
        quantity: 10
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Kaju Katli');
    expect(res.body.price).toBe(25);
  });

  it('❌ should return 404 for invalid id', async () => {
    const res = await request(app)
      .put('/api/sweets/9999')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test' });

    expect(res.status).toBe(404);
  });
});

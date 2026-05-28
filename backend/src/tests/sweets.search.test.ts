import request from 'supertest';
import app from '../server';
import { query } from '../config/database';
import bcrypt from 'bcrypt';

let token: string;

beforeAll(async () => {
  await query('TRUNCATE TABLE sweets RESTART IDENTITY CASCADE');
  await query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');

  const hashed = await bcrypt.hash('password123', 10);

  await query(
    `INSERT INTO users (email, password)
     VALUES ($1, $2)`,
    ['testuser@test.com', hashed]
  );

  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'testuser@test.com',
      password: 'password123'
    });

  token = res.body.token;

  await query(
    `INSERT INTO sweets (name, category, price, quantity)
     VALUES ($1, $2, $3, $4)`,
    ['Ladoo', 'Indian', 10, 5]
  );
});

describe('GET /api/sweets/search', () => {
  it('should search sweets by name', async () => {
    const res = await request(app)
      .get('/api/sweets/search?q=ladoo')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].name).toBe('Ladoo');
  });
});

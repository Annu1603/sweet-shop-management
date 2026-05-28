import request from 'supertest';
import app from '../server';
import { query } from '../config/database';
import bcrypt from 'bcrypt';

let token: string;

beforeAll(async () => {
  await query('DELETE FROM users');

  const hashed = await bcrypt.hash('password123', 10);

  await query(
    `INSERT INTO users (email, password)
     VALUES ($1, $2)`,
    ['test@test.com', hashed]
  );

  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test@test.com',
      password: 'password123'
    });

  token = res.body.token;
});

describe('Sweets validation tests', () => {
  it('❌ should return 400 for empty search query', async () => {
    const res = await request(app)
      .get('/api/sweets/search?q=')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});



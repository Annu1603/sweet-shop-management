import { query, pool } from '../config/database';

beforeAll(async () => {
  await query(`TRUNCATE TABLE sweets RESTART IDENTITY CASCADE`);
  await query(`TRUNCATE TABLE users RESTART IDENTITY CASCADE`);
});

afterAll(async () => {
  await pool.end(); // 🔥 prevents Jest open-handle leak
});

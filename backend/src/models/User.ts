import bcrypt from 'bcrypt';
import { query } from '../config/database';

export const UserModel = {
  async findByEmail(email: string) {
    const res = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return res.rows[0];
  },

  async create(
  email: string,
  password: string,
  is_admin: boolean = false
) {
  const hashed = await bcrypt.hash(password, 10);

  const res = await query(
    `
    INSERT INTO users (email, password, is_admin)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [email, hashed, is_admin]
  );

  return res.rows[0];
},

  async verifyPassword(user: any, password: string) {
    return bcrypt.compare(password, user.password);
  }
};



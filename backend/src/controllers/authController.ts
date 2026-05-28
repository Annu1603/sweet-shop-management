import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';

export class AuthController {

  static async register(req: Request, res: Response) {
  try {
    const { email, password, is_admin } = req.body;

    // Check existing user
    const existingUser = await UserModel.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
      });
    }

    // Create user
    const user = await UserModel.create(
  email,
  password,
  is_admin || false
);

    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.is_admin,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        is_admin: user.is_admin,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: 'Registration failed',
    });
  }
}

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await UserModel.verifyPassword(user, password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // ✅ MATCHES TEST EXPECTATION
const token = jwt.sign(
  {
    userId: user.id,            // ✅ REQUIRED
    isAdmin: user.is_admin,     // ✅ REQUIRED
  },
  process.env.JWT_SECRET!,
  { expiresIn: '1h' }
);




    res.json({ token });
  }
}

import { Response } from 'express';
import { SweetModel } from '../models/Sweet';
import { AuthRequest } from '../middleware/auth';
import { query } from '../config/database';

export class SweetsController {
  static async create(req: AuthRequest, res: Response) {
    const sweet = await SweetModel.create(req.body);
    res.status(201).json(sweet);
  }

  static async getAll(req: AuthRequest, res: Response) {
    res.json(await SweetModel.findAll());
  }

  // ==========================
  // ✅ PURCHASE (TEST SAFE)
  // ==========================
  static async purchase(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const sweetId = Number(req.params.id);
    const quantity = Number(req.body.quantity);

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const result = await query(
      'SELECT quantity FROM sweets WHERE id = $1',
      [sweetId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    if (quantity > result.rows[0].quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const updated = await query(
      'UPDATE sweets SET quantity = quantity - $1 WHERE id = $2 RETURNING *',
      [quantity, sweetId]
    );

    res.status(200).json(updated.rows[0]);
  }

  // ==========================
  // ✅ RESTOCK (ADMIN ONLY)
  // ==========================
  static async restock(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const sweetId = Number(req.params.id);
    const quantity = Number(req.body.quantity);

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid restock quantity' });
    }

    const result = await query(
      'UPDATE sweets SET quantity = quantity + $1 WHERE id = $2 RETURNING *',
      [quantity, sweetId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    res.json({ message: 'Restocked successfully' });
  }

  static async delete(req: AuthRequest, res: Response) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!req.user.isAdmin) return res.status(403).json({ error: 'Forbidden' });

    await SweetModel.delete(Number(req.params.id));
    res.json({ message: 'Deleted' });
  }

  static async search(req: AuthRequest, res: Response) {
    const q = req.query.q as string;

    if (!q) {
      return res.status(400).json({ error: 'Query required' });
    }

    const sweets = await SweetModel.search(q);
    res.json(sweets);
  }

  static async update(req: AuthRequest, res: Response) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!req.user.isAdmin) return res.status(403).json({ error: 'Forbidden' });

    const updated = await SweetModel.update(
      Number(req.params.id),
      req.body
    );

    if (!updated) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    res.json(updated);
  }
}

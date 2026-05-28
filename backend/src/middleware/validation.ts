import { Request, Response, NextFunction } from 'express';

/* ================= PURCHASE ================= */

export const validatePurchaseQuantity = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { quantity } = req.body;

  if (typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).json({
      error: 'Invalid quantity',
    });
  }

  next();
};

/* ================= RESTOCK ================= */

export const validateRestockQuantity = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const amount = req.body.quantity; // 🔥 FIX HERE

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({
      error: 'Invalid restock quantity',
    });
  }

  // normalize for controller
  req.body.amount = amount;
  next();
};



/* ================= SEARCH ================= */

export const validateSearchQuery = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { q } = req.query;

  if (!q || typeof q !== 'string' || q.trim() === '') {
    return res.status(400).json({
      error: 'Search query is required',
    });
  }

  next();
};

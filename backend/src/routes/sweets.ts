import { Router } from 'express';
import { SweetsController } from '../controllers/sweetsController';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';
import {
  validatePurchaseQuantity,
  validateRestockQuantity,
} from '../middleware/validation';

const router = Router();

/* ---------------- PUBLIC / AUTH ---------------- */
router.get('/search', SweetsController.search);
router.get('/', SweetsController.getAll);



/* ---------------- ADMIN ---------------- */

router.post('/', authMiddleware, adminMiddleware, SweetsController.create);

router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  SweetsController.update
);

router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  SweetsController.delete
);

router.post(
  '/:id/purchase',
  validatePurchaseQuantity,   // 👈 FIRST → 400
  authMiddleware,             // 👈 SECOND → 401
  SweetsController.purchase
);


router.post(
  '/:id/restock',
  validateRestockQuantity,    // 👈 FIRST → 400
  authMiddleware,             // 👈 SECOND → 401
  adminMiddleware,            // 👈 THIRD → 403
  SweetsController.restock
);


export default router;

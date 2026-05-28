import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();

// ❌ REMOVE REGISTER (causes duplicate email errors in tests)
 router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

export default router;

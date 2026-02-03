
import { Router } from 'express';
import * as authController from './auth.controller';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/users/:id', authController.updateUser);
router.delete('/users/:id', authController.deleteUser);

export default router;

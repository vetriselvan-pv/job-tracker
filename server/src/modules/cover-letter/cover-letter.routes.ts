import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware';
import * as coverLetterController from './cover-letter.controller';

const router = Router();

router.use(authenticate);
router.post('/generate', coverLetterController.generate);

export default router;

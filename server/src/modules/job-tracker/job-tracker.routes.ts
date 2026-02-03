
import { Router } from 'express';
import * as jobController from './job-tracker.controller';
import { authenticate } from '../auth/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', jobController.create);
router.get('/', jobController.findAll);
router.get('/:id', jobController.findOne);
router.put('/:id', jobController.update);
router.delete('/:id', jobController.remove);

export default router;

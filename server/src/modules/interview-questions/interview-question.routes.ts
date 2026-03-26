import { Router } from 'express';
import * as interviewQuestionController from './interview-question.controller';

const router = Router();

router.get('/', interviewQuestionController.findAll);
router.get('/:id', interviewQuestionController.findOne);
router.post('/', interviewQuestionController.create);
router.put('/:id', interviewQuestionController.update);

export default router;

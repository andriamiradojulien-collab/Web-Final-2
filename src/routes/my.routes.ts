import { Router } from 'express';
import { authenticate, requireRole } from '../security/middleware';
import { myController } from '../controller/myController';

const router = Router();
router.use(authenticate, requireRole('student'));
router.get('/exams', myController.listExams);
router.get('/exams/:id', myController.getExam);
router.post('/exams/:id/submit', myController.submit);
router.get('/results', myController.myResults);
export default router;

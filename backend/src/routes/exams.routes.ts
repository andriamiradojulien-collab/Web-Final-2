import { Router } from 'express';
import { authenticate, requireRole } from '../security/middleware';
import { examController } from '../controller/examController';
import { questionController } from '../controller/questionController';

const router = Router();

router.use(authenticate, requireRole('admin'));

router.get('/', examController.list);
router.post('/', examController.create);
router.get('/:id', examController.getOne);
router.put('/:id', examController.update);
router.delete('/:id', examController.remove);

router.get('/:id/questions', questionController.listForExam);
router.post('/:id/questions', questionController.create);

router.get('/:id/results', examController.results);

export default router;
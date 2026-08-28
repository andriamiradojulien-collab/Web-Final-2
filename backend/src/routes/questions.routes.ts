import { Router } from 'express';
import { authenticate, requireRole } from '../security/middleware';
import { questionController } from '../controller/questionController';

const router = Router();
router.use(authenticate, requireRole('admin'));
router.put('/:id', questionController.update);
router.delete('/:id', questionController.remove);
export default router;

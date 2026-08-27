import { Router } from 'express';
import { authenticate, requireRole } from '../security/middleware';
import { courseController } from '../controller/courseController';

const router = Router();
router.use(authenticate, requireRole('admin'));
router.get('/', courseController.list);
router.post('/', courseController.create);
router.put('/:id', courseController.update);
router.delete('/:id', courseController.remove);
export default router;

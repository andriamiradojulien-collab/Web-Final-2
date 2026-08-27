import { Router } from 'express';
import { authenticate, requireRole } from '../security/middleware';
import { studentController } from '../controller/studentController';

const router = Router();
router.use(authenticate, requireRole('admin'));
router.get('/', studentController.list);
router.post('/', studentController.create);
router.put('/:id', studentController.update);
router.delete('/:id', studentController.deactivate);
export default router;

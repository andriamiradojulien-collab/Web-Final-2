import { Request, Response, NextFunction } from 'express';
import { studentService } from '../service/studentService';

export const studentController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try { res.json(await studentService.list()); } catch (err) { next(err); }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      res.status(201).json(await studentService.create(email, password));
    } catch (err) { next(err); }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try { res.json(await studentService.update(Number(req.params.id), req.body)); } catch (err) { next(err); }
  },
  async deactivate(req: Request, res: Response, next: NextFunction) {
    try { res.json(await studentService.deactivate(Number(req.params.id))); } catch (err) { next(err); }
  },
};

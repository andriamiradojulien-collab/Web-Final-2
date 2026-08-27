import { Request, Response, NextFunction } from 'express';
import { courseService } from '../service/courseService';

export const courseController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try { res.json(await courseService.list()); } catch (err) { next(err); }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, name, description } = req.body;
      res.status(201).json(await courseService.create(code, name, description));
    } catch (err) { next(err); }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try { res.json(await courseService.update(Number(req.params.id), req.body)); } catch (err) { next(err); }
  },
  async remove(req: Request, res: Response, next: NextFunction) {
    try { await courseService.remove(Number(req.params.id)); res.status(204).send(); } catch (err) { next(err); }
  },
};

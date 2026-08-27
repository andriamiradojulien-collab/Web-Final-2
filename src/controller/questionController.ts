import { Request, Response, NextFunction } from 'express';
import { questionService } from '../service/questionService';

export const questionController = {
  async listForExam(req: Request, res: Response, next: NextFunction) {
    try { res.json(await questionService.listForExam(Number(req.params.id))); } catch (err) { next(err); }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { statement, points, choices } = req.body;
      res.status(201).json(await questionService.create(Number(req.params.id), statement, points, choices));
    } catch (err) { next(err); }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { statement, points, choices } = req.body;
      res.json(await questionService.update(Number(req.params.id), statement, points, choices));
    } catch (err) { next(err); }
  },
  async remove(req: Request, res: Response, next: NextFunction) {
    try { await questionService.remove(Number(req.params.id)); res.status(204).send(); } catch (err) { next(err); }
  },
};

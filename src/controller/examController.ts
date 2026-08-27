import { Request, Response, NextFunction } from 'express';
import { examService } from '../service/examService';
import { examResultService } from '../service/examResultService';

export const examController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try { res.json(await examService.list()); } catch (err) { next(err); }
  },
  async getOne(req: Request, res: Response, next: NextFunction) {
    try { res.json(await examService.getById(Number(req.params.id))); } catch (err) { next(err); }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId, name, startDate, endDate } = req.body;
      res.status(201).json(await examService.create(courseId, name, startDate, endDate));
    } catch (err) { next(err); }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try { res.json(await examService.update(Number(req.params.id), req.body)); } catch (err) { next(err); }
  },
  async remove(req: Request, res: Response, next: NextFunction) {
    try { await examService.remove(Number(req.params.id)); res.status(204).send(); } catch (err) { next(err); }
  },
  async results(req: Request, res: Response, next: NextFunction) {
    try { res.json(await examResultService.getResults(Number(req.params.id))); } catch (err) { next(err); }
  },
};

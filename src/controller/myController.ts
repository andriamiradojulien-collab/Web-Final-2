import { Request, Response, NextFunction } from 'express';
import { attemptService } from '../service/attemptService';

export const myController = {
  async listExams(req: Request, res: Response, next: NextFunction) {
    try { res.json(await attemptService.listAvailableExams(req.user!.sub)); } catch (err) { next(err); }
  },
  async getExam(req: Request, res: Response, next: NextFunction) {
    try { res.json(await attemptService.getExamForStudent(req.user!.sub, Number(req.params.id))); } catch (err) { next(err); }
  },
  async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const { answers } = req.body;
      res.status(201).json(await attemptService.submit(req.user!.sub, Number(req.params.id), answers ?? []));
    } catch (err) { next(err); }
  },
  async myResults(req: Request, res: Response, next: NextFunction) {
    try { res.json(await attemptService.getMyResults(req.user!.sub)); } catch (err) { next(err); }
  },
};

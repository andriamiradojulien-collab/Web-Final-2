import { Request, Response, NextFunction } from 'express';
import { attemptService } from '../service/attemptService';

export const myController = {
  async listExams(req: Request, res: Response, next: NextFunction) {
    try {
      const exams = await attemptService.listAvailableExams(req.user!.sub);
      return res.status(200).json(exams);
    } catch (err) {
      next(err);
    }
  },

  async getExam(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.user!.sub;
      const examId = Number(req.params.id);
      const exam = await attemptService.getExamForStudent(studentId, examId);
      return res.status(200).json(exam);
    } catch (err) {
      next(err);
    }
  },

  async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.user!.sub;
      const examId = Number(req.params.id);
      const { answers } = req.body;
      const result = await attemptService.submit(studentId, examId, answers ?? []);
      return res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  async myResults(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.user!.sub;
      const results = await attemptService.getMyResults(studentId);
      return res.status(200).json(results);
    } catch (err) {
      next(err);
    }
  }
};
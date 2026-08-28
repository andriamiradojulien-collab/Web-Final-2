import { Request, Response, NextFunction } from 'express';
import { questionService } from '../service/questionService';

export const questionController = {
  async listForExam(req: Request, res: Response, next: NextFunction) {
    try {
      const examId = Number(req.params.id);
      const questions = await questionService.listForExam(examId);
      return res.status(200).json(questions);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const examId = Number(req.params.id);
      const { statement, points, choices } = req.body;
      const newQuestion = await questionService.create(examId, statement, points, choices);
      return res.status(201).json(newQuestion);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const questionId = Number(req.params.id);
      const { statement, points, choices } = req.body;
      const updatedQuestion = await questionService.update(questionId, statement, points, choices);
      return res.status(200).json(updatedQuestion);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const questionId = Number(req.params.id);
      await questionService.remove(questionId);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
};
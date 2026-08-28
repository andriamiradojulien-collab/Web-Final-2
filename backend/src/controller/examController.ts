import { Request, Response, NextFunction } from 'express';
import { examService } from '../service/examService';
import { examResultService } from '../service/examResultService';

export const examController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const exams = await examService.list();
      return res.status(200).json(exams);
    } catch (err) {
      next(err);
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const exam = await examService.getById(id);
      return res.status(200).json(exam);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId, name, startDate, endDate } = req.body;
      const newExam = await examService.create(courseId, name, startDate, endDate);
      return res.status(201).json(newExam);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const updatedExam = await examService.update(id, req.body);
      return res.status(200).json(updatedExam);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await examService.remove(id);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async results(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const results = await examResultService.getResults(id);
      return res.status(200).json(results);
    } catch (err) {
      next(err);
    }
  }
};
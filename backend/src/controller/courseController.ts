import { Request, Response, NextFunction } from 'express';
import { courseService } from '../service/courseService';

export const courseController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await courseService.list();
      return res.status(200).json(courses);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, name, description } = req.body;
      const newCourse = await courseService.create(code, name, description);
      return res.status(201).json(newCourse);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const updatedCourse = await courseService.update(id, req.body);
      return res.status(200).json(updatedCourse);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await courseService.remove(id);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
};
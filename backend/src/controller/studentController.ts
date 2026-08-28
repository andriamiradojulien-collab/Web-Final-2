import { Request, Response, NextFunction } from 'express';
import { studentService } from '../service/studentService';

export const studentController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const students = await studentService.list();
      return res.status(200).json(students);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const newStudent = await studentService.create(email, password);
      return res.status(201).json(newStudent);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = Number(req.params.id);
      const updatedStudent = await studentService.update(studentId, req.body);
      return res.status(200).json(updatedStudent);
    } catch (err) {
      next(err);
    }
  },

  async deactivate(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = Number(req.params.id);
      const deactivatedStudent = await studentService.deactivate(studentId);
      return res.status(200).json(deactivatedStudent);
    } catch (err) {
      next(err);
    }
  }
};
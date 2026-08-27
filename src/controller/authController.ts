import { Request, Response, NextFunction } from 'express';
import { authService } from '../service/authService';

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis' });
      const result = await authService.login(email, password);
      res.status(200).json(result);
    } catch (err) { next(err); }
  },
};

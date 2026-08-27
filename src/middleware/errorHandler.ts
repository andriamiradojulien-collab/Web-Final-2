import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

// RG-13 : toute erreur d'API renvoie {"message": "..."} avec le code HTTP approprié
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: 'Erreur interne du serveur' });
}

import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from './jwt';
import { ApiError } from '../utils/ApiError';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authentification requise'));
  }

  const token = header.slice('Bearer '.length);
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(new ApiError(401, 'Token invalide ou expiré'));
  }
}

export function requireRole(role: 'admin' | 'student') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new ApiError(401, 'Authentification requise'));
    if (req.user.role !== role) return next(new ApiError(403, 'Accès refusé'));
    next();
  };
}
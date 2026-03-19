import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt.js';

// Расширяем тип Request чтобы хранить данные пользователя
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    // Берём токен из заголовка Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Access token required',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    // Добавляем данные пользователя в запрос
    req.user = payload;
    next();
  } catch {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
}

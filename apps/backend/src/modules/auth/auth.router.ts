import { Router, Request, Response, IRouter } from 'express';
import * as authService from './auth.service.js';
import { RegisterRequest, LoginRequest, RefreshRequest } from './auth.types.js';
import { authMiddleware } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';

export const authRouter: IRouter = Router();

// ─── POST /api/auth/register ───────────────────────────────────────
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const body = req.body as RegisterRequest;

    // Базовая валидация
    if (!body.email || !body.username || !body.password) {
      res.status(400).json({
        success: false,
        error: 'Email, username and password are required',
      });
      return;
    }

    if (body.password.length < 6) {
      res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
      return;
    }

    const result = await authService.register(body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    res.status(400).json({
      success: false,
      error: message,
    });
  }
});

// ─── POST /api/auth/login ──────────────────────────────────────────
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const body = req.body as LoginRequest;

    if (!body.email || !body.password) {
      res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
      return;
    }

    const result = await authService.login(body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    res.status(401).json({
      success: false,
      error: message,
    });
  }
});

// ─── POST /api/auth/refresh ────────────────────────────────────────
authRouter.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body as RefreshRequest;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        error: 'Refresh token required',
      });
      return;
    }

    const result = await authService.refresh(refreshToken);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired refresh token',
    });
  }
});

// ─── GET /api/auth/me ──────────────────────────────────────────────
authRouter.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        username: true,
        plan: true,
        generationsToday: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    res.json({ success: true, data: user });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ─── POST /api/auth/logout ─────────────────────────────────────────
authRouter.post('/logout', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body as RefreshRequest;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        error: 'Refresh token required',
      });
      return;
    }

    await authService.logout(refreshToken);

    res.status(200).json({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  } catch {
    res.status(500).json({
      success: false,
      error: 'Logout failed',
    });
  }
});

// ─── DELETE /api/auth/account ──────────────────────────────────────
authRouter.delete('/account', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    // Удаляем всё связанное с пользователем (каскадно через Prisma)
    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({
      success: true,
      data: { message: 'Account deleted successfully' },
    });
  } catch {
    res.status(500).json({
      success: false,
      error: 'Failed to delete account',
    });
  }
});

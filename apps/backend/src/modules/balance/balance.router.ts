import { Router, Request, Response, IRouter } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';

export const balanceRouter: IRouter = Router();

balanceRouter.use(authMiddleware);

// ─── GET /api/balance ──────────────────────────────────────────
balanceRouter.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    // Получаем или создаём баланс
    let balance = await prisma.balance.findUnique({
      where: { userId },
    });

    if (!balance) {
      balance = await prisma.balance.create({
        data: { userId, amount: 0 },
      });
    }

    res.json({ success: true, data: balance });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch balance' });
  }
});

// ─── GET /api/balance/transactions ────────────────────────────
balanceRouter.get('/transactions', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.json({ success: true, data: transactions });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch transactions' });
  }
});
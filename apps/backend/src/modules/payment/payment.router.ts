import { Router, Request, Response, IRouter } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';
import { YooCheckout } from '@a2seven/yoo-checkout';
import crypto from 'crypto';

const checkout = new YooCheckout({
  shopId: process.env.YUKASSA_SHOP_ID!,
  secretKey: process.env.YUKASSA_SECRET_KEY!,
});

export const paymentRouter: IRouter = Router();

// ─── POST/GET /api/payment/create ──────────────────────────────────
async function handleWebhook(req: Request, res: Response) {
  try {
    const event = req.body;
    console.log('Webhook received:', JSON.stringify(event));

    if (event.type === 'payment.succeeded') {
      const paymentId = event.object.id;
      const userId = event.object.metadata?.userId;
      const amount = parseFloat(event.object.amount.value);

      if (!userId) {
        res.status(400).json({ error: 'No userId in metadata' });
        return;
      }

      await prisma.transaction.updateMany({
        where: { yukassaId: paymentId },
        data: { status: 'SUCCEEDED' },
      });

      await prisma.balance.upsert({
        where: { userId },
        update: { amount: { increment: amount } },
        create: { userId, amount },
      });

      console.log(`✅ Balance topped up: ${amount}₽ for user ${userId}`);
    }

    if (event.type === 'payment.canceled') {
      const paymentId = event.object.id;
      await prisma.transaction.updateMany({
        where: { yukassaId: paymentId },
        data: { status: 'CANCELLED' },
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

paymentRouter.post('/webhook', handleWebhook);
paymentRouter.get('/webhook', handleWebhook);
// ─── POST /api/payment/webhook ─────────────────────────────────
paymentRouter.post('/webhook', async (req: Request, res: Response) => {
  try {
    const event = req.body;

    if (event.type === 'payment.succeeded') {
      const paymentId = event.object.id;
      const userId = event.object.metadata?.userId;
      const amount = parseFloat(event.object.amount.value);

      if (!userId) {
        res.status(400).json({ error: 'No userId in metadata' });
        return;
      }

      // Обновляем транзакцию
      await prisma.transaction.updateMany({
        where: { yukassaId: paymentId },
        data: { status: 'SUCCEEDED' },
      });

      // Пополняем баланс
      await prisma.balance.upsert({
        where: { userId },
        update: { amount: { increment: amount } },
        create: { userId, amount },
      });

      console.log(`✅ Balance topped up: ${amount}₽ for user ${userId}`);
    }

    if (event.type === 'payment.canceled') {
      const paymentId = event.object.id;
      await prisma.transaction.updateMany({
        where: { yukassaId: paymentId },
        data: { status: 'CANCELLED' },
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

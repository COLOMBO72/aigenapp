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

    if (event.event === 'payment.succeeded' || event.type === 'payment.succeeded') {
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

    if (event.event === 'payment.canceled' || event.type === 'payment.canceled') {
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

// ─── POST /api/payment/create ──────────────────────────────────
paymentRouter.post('/create', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    const userId = req.user!.userId;

    if (!amount || amount < 50) {
      res.status(400).json({ success: false, error: 'Минимальная сумма пополнения 50₽' });
      return;
    }

    const idempotenceKey = crypto.randomUUID();

    const payment = await checkout.createPayment(
      {
        amount: {
          value: amount.toFixed(2),
          currency: 'RUB',
        },
        confirmation: {
          type: 'redirect',
          return_url: `${process.env.WEBSITE_URL}/dashboard?payment=success`,
        },
        description: `Пополнение баланса Velium на ${amount}₽`,
        metadata: {
          userId,
          type: 'balance_topup',
        },
        capture: true,
      },
      idempotenceKey,
    );

    await prisma.transaction.create({
      data: {
        userId,
        type: 'DEPOSIT',
        amount,
        description: `Пополнение баланса на ${amount}₽`,
        status: 'PENDING',
        yukassaId: payment.id,
      },
    });

    res.json({
      success: true,
      data: {
        paymentId: payment.id,
        confirmationUrl: (payment.confirmation as any).confirmation_url,
      },
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ success: false, error: 'Ошибка создания платежа' });
  }
});

//getspost

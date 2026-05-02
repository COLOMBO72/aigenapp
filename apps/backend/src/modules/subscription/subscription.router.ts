import { Router, Request, Response, IRouter } from 'express';
import { authMiddleware } from '../../middleware/auth.js';
import { prisma } from '../../lib/prisma.js';

export const subscriptionRouter: IRouter = Router();

subscriptionRouter.use(authMiddleware);

const PRICES = {
  pictures_vip_month: 299,
  vpn_month: 219,
  vpn_year: 1890,
  vpn_basic_month: 100,
  vpn_basic_year: 960,
  vpn_standard_month: 180,
  vpn_standard_year: 1728,
};

const PREMIUM_CREDITS = 50;

// ─── POST /api/subscription/purchase ──────────────────────────
subscriptionRouter.post('/purchase', async (req: Request, res: Response) => {
  try {
    const { plan } = req.body;
    const userId = req.user!.userId;

    if (!PRICES[plan as keyof typeof PRICES]) {
      res.status(400).json({ success: false, error: 'Неверный тариф' });
      return;
    }

    const price = PRICES[plan as keyof typeof PRICES];

    // Проверяем баланс
    const balance = await prisma.balance.findUnique({ where: { userId } });
    if (!balance || balance.amount < price) {
      res.status(400).json({
        success: false,
        error: `Недостаточно средств. Нужно ${price}₽, доступно ${balance?.amount || 0}₽`,
      });
      return;
    }

    // Определяем сервис и длительность
    const service = plan.startsWith('pictures') ? 'PICTURES' : 'VPN';
    const months = plan.endsWith('year') ? 12 : 1;
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + months);

    // Списываем с баланса
    await prisma.balance.update({
      where: { userId },
      data: { amount: { decrement: price } },
    });

    // Записываем транзакцию
    await prisma.transaction.create({
      data: {
        userId,
        type: 'SUBSCRIPTION',
        amount: price,
        description: `Подписка ${service} на ${months === 12 ? 'год' : 'месяц'}`,
        status: 'SUCCEEDED',
      },
    });

    // Активируем подписку
    await prisma.subscription.upsert({
      where: { userId },
      update: {
        status: 'ACTIVE',
        expiresAt,
        autoRenew: true,
        updatedAt: new Date(),
      },
      create: {
        userId,
        service: service as any,
        plan: 'PREMIUM',
        status: 'ACTIVE',
        autoRenew: true,
        expiresAt,
      },
    });

    // Если имагеген — даём Premium кредиты и меняем план
    if (service === 'PICTURES') {
      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: 'PREMIUM',
          premiumCredits: { increment: PREMIUM_CREDITS },
        },
      });
    }

    res.json({
      success: true,
      data: {
        message: `Подписка активирована до ${expiresAt.toLocaleDateString('ru-RU')}`,
        expiresAt,
        service,
      },
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ success: false, error: 'Ошибка активации подписки' });
  }
});
// ─── POST /api/subscription/vpn-device ────────────────────────
subscriptionRouter.post('/vpn-device', async (req: Request, res: Response) => {
  try {
    const { deviceId, plan, billingType } = req.body;
    const userId = req.user!.userId;

    const planKey =
      `vpn_${plan}_${billingType === 'yearly' ? 'year' : 'month'}` as keyof typeof PRICES;
    const price = PRICES[planKey];

    if (!price) {
      res.status(400).json({ success: false, error: 'Неверный тариф' });
      return;
    }

    // Проверяем баланс
    const balance = await prisma.balance.findUnique({ where: { userId } });
    if (!balance || balance.amount < price) {
      res.status(400).json({
        success: false,
        error: `Недостаточно средств. Нужно ${price}₽, доступно ${balance?.amount || 0}₽`,
      });
      return;
    }

    // Списываем баланс
    await prisma.balance.update({
      where: { userId },
      data: { amount: { decrement: price } },
    });

    // Записываем транзакцию
    const months = billingType === 'yearly' ? 12 : 1;
    await prisma.transaction.create({
      data: {
        userId,
        type: 'SUBSCRIPTION',
        amount: price,
        description: `VPN ${plan} на ${months === 12 ? 'год' : 'месяц'} (устройство ${deviceId})`,
        status: 'SUCCEEDED',
      },
    });

    // Активируем подписку на устройстве через VPN сервер
    const vpnRes = await fetch(`http://localhost:3000/api/vpn/devices/${deviceId}/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, billingType, userId }),
    });

    const vpnData = (await vpnRes.json()) as { error?: string; subscriptionEndsAt?: string };
    if (!vpnRes.ok) {
      throw new Error(vpnData.error || 'Ошибка активации VPN');
    }

    res.json({
      success: true,
      data: {
        message: `VPN ${plan} активирован`,
        subscriptionEndsAt: vpnData.subscriptionEndsAt,
      },
    });
  } catch (error) {
    console.error('VPN subscription error:', error);
    res.status(500).json({ success: false, error: 'Ошибка активации подписки' });
  }
});
// ─── GET /api/subscription/status ─────────────────────────────
subscriptionRouter.get('/status', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const [user, balance, subscription] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.balance.findUnique({ where: { userId } }),
      prisma.subscription.findUnique({ where: { userId } }),
    ]);

    res.json({
      success: true,
      data: {
        plan: user?.plan,
        premiumCredits: user?.premiumCredits || 0,
        balance: balance?.amount || 0,
        subscription: subscription || null,
      },
    });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

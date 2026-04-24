import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma.js';
import { authRouter } from './modules/auth/auth.router.js';
import { generateRouter } from './modules/generate/generate.router.js';
import { balanceRouter } from './modules/balance/balance.router.js';
import { paymentRouter } from './modules/payment/payment.router.js';
import { subscriptionRouter } from './modules/subscription/subscription.router.js';

dotenv.config();

const app: Express = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(helmet());
app.use(
  cors({
    origin: [
      'http://localhost:3001',
      'https://velium.vercel.app',
      'https://aigenapp-backend.vercel.app',
      /\.vercel\.app$/,
    ],
    credentials: true,
  }),
);
app.use(express.json());

// ─── Health check ──────────────────────────────────────────────────
app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      message: 'Server is running',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
    });
  }
});

// ─── Routes ────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/generate', generateRouter);
app.use('/api/balance', balanceRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/subscription', subscriptionRouter);

// ─── Graceful shutdown ─────────────────────────────────────────────
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing connections...');
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV}`);
});

export default app;

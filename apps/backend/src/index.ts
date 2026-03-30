import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma.js';
import { authRouter } from './modules/auth/auth.router.js';
import { generateRouter } from './modules/generate/generate.router.js';
import { createWorker } from './modules/generate/generate.worker.js';
import { balanceRouter } from './modules/balance/balance.router.js';

// В routes секции добавь:


dotenv.config();

const app: Express = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://velium.vercel.app',
  ],
  credentials: true,
}));
app.use(express.json());
app.use('/api/balance', balanceRouter);

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

// ─── Запускаем воркер ──────────────────────────────────────────────
const worker = createWorker();
console.log('⚡ Generation worker started');

// ─── Graceful shutdown ─────────────────────────────────────────────
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing connections...');
  await worker.close();
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Network: http://192.168.0.141:${PORT}`);
});

export default app;
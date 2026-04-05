import dotenv from 'dotenv';
dotenv.config();

import { createWorker } from './modules/generate/generate.worker.js';
import { prisma } from './lib/prisma.js';

console.log('⚡ Starting generation worker...');

const worker = createWorker();

console.log('✅ Worker started successfully');

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing worker...');
  await worker.close();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing worker...');
  await worker.close();
  await prisma.$disconnect();
  process.exit(0);
});
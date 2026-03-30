import dotenv from 'dotenv';
dotenv.config();

export const redisConnection = process.env.REDIS_URL
  ? {
      url: process.env.REDIS_URL,
      tls: process.env.REDIS_URL.startsWith('rediss://') 
        ? {} 
        : undefined,
    }
  : {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    };
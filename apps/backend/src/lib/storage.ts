import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

export const s3Client = new S3Client({
  endpoint: process.env.STORAGE_ENDPOINT || 'https://storage.yandexcloud.net',
  region: process.env.STORAGE_REGION || 'ru-central1',
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY!,
    secretAccessKey: process.env.STORAGE_SECRET_KEY!,
  },
});

export const BUCKET_NAME = process.env.STORAGE_BUCKET!;
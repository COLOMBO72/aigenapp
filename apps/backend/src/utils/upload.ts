import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, BUCKET_NAME } from '../lib/storage.js';

export async function uploadImageToStorage(
  base64Image: string,
  generationId: string
): Promise<string> {
  // Конвертируем base64 в Buffer
  const imageBuffer = Buffer.from(base64Image, 'base64');
  const key = `generations/${generationId}.png`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: imageBuffer,
      ContentType: 'image/png',
    })
  );

  // Возвращаем публичный URL картинки
  const endpoint = process.env.STORAGE_ENDPOINT || 'https://storage.yandexcloud.net';
  return `${endpoint}/${BUCKET_NAME}/${key}`;
}
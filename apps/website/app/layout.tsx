import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Velium Pictures — Генерация изображений с помощью ИИ',
  description: 'Создавайте уникальные изображения с помощью искусственного интеллекта. Просто опишите что хотите увидеть.',
  keywords: 'генерация изображений, ИИ, искусственный интеллект, Stable Diffusion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
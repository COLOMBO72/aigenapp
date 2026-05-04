import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Velium Service',
  description: 'Apps Creator',
  keywords: 'генерация изображений, ИИ, искусственный интеллект, Stable Diffusion, VPN, ВПН',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}

// ─── Пользователь ───────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  username: string;
  plan: 'free' | 'premium';
  generationsToday: number;
  generationsLimit: number;
  createdAt: string;
}

// ─── Генерация изображения ───────────────────────────────────────
export interface Generation {
  id: string;
  userId: string;
  prompt: string;
  imageUrl: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
}

// ─── API запросы ─────────────────────────────────────────────────
export interface GenerateImageRequest {
  prompt: string;
}

export interface GenerateImageResponse {
  generationId: string;
  status: Generation['status'];
}

// ─── API ответы ──────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ─── Подписка ────────────────────────────────────────────────────
export interface Subscription {
  id: string;
  userId: string;
  plan: 'premium';
  status: 'active' | 'cancelled' | 'expired';
  expiresAt: string;
}

// ─── Лимиты по тарифам ───────────────────────────────────────────
export const PLAN_LIMITS = {
  free: {
    generationsPerDay: 5,
    maxResolution: '512x512',
  },
  premium: {
    generationsPerDay: Infinity,
    maxResolution: '1024x1024',
  },
} as const;
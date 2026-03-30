// ─── Пользователь ───────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  username: string;
  plan: 'FREE' | 'PREMIUM';
  generationsToday: number;
  premiumCredits: number;
  generationsLimit: number;
  createdAt: string;
}

// ─── Баланс ─────────────────────────────────────────────────────
export interface Balance {
  id: string;
  userId: string;
  amount: number;
  updatedAt: string;
}

// ─── Транзакция ──────────────────────────────────────────────────
export interface Transaction {
  id: string;
  userId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'SUBSCRIPTION' | 'GENERATION';
  amount: number;
  description: string;
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED';
  createdAt: string;
}

// ─── Генерация изображения ───────────────────────────────────────
export interface Generation {
  id: string;
  userId: string;
  prompt: string;
  imageUrl: string | null;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  isPremium: boolean;
  createdAt: string;
}

// ─── Подписка ────────────────────────────────────────────────────
export interface Subscription {
  id: string;
  userId: string;
  service: 'PICTURES' | 'VPN';
  plan: 'FREE' | 'PREMIUM';
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  autoRenew: boolean;
  expiresAt: string;
}

// ─── API запросы ─────────────────────────────────────────────────
export interface GenerateImageRequest {
  prompt: string;
  isPremium?: boolean;
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

// ─── Лимиты по тарифам ───────────────────────────────────────────
export const PLAN_LIMITS = {
  free: {
    generationsPerDay: 5,
    maxResolution: '512x512',
    premiumCredits: 0,
  },
  premium: {
    generationsPerDay: Infinity,
    maxResolution: '1024x1024',
    premiumCredits: 50,
  },
} as const;

// ─── Цены ────────────────────────────────────────────────────────
export const PRICES = {
  pictures: {
    monthly: 299,
    yearly: 1990,
    perGeneration: 5,
  },
  vpn: {
    monthly: 199,
    yearly: 1490,
  },
} as const;
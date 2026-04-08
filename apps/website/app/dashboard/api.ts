const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<{
      success: boolean;
      data: { accessToken: string; refreshToken: string; user: any };
    }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (email: string, username: string, password: string) =>
    apiRequest<{
      success: boolean;
      data: { accessToken: string; refreshToken: string; user: any };
    }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    }),

  me: () => apiRequest<{ success: boolean; data: any }>('/api/auth/me'),
};
export const paymentApi = {
  create: (amount: number) =>
    apiRequest<{ success: boolean; data: { paymentId: string; confirmationUrl: string } }>(
      '/api/payment/create',
      { method: 'POST', body: JSON.stringify({ amount }) }
    ),
};
export const balanceApi = {
  get: () => apiRequest<{ success: boolean; data: any }>('/api/balance'),
  transactions: () => apiRequest<{ success: boolean; data: any[] }>('/api/balance/transactions'),
};

'use client';

import { useState, useEffect } from 'react';
import { authApi, balanceApi, paymentApi, subscriptionApi } from './api';
import { setTokens, clearTokens, getToken } from './auth';

type Screen = 'login' | 'register' | 'dashboard';

export default function DashboardPage() {
  const [screen, setScreen] = useState<Screen>('login');
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [topUpAmount, setTopUpAmount] = useState(299);
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);
  const [customAmount, setCustomAmount] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Форма логина
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      setScreen('login');
      return;
    }
    try {
      const res = await authApi.me();
      setUser(res.data);
      await loadDashboardData();
      setScreen('dashboard');
    } catch {
      clearTokens();
      setScreen('login');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      const [balanceRes, txRes] = await Promise.all([balanceApi.get(), balanceApi.transactions()]);
      setBalance(balanceRes.data.amount);
      setTransactions(txRes.data);
    } catch {}
  };

  const handleLogin = async () => {
    if (!email || !password) return;
    setFormLoading(true);
    setError('');
    try {
      const res = await authApi.login(email, password);
      setTokens(res.data.accessToken, res.data.refreshToken);
      setUser(res.data.user);
      await loadDashboardData();
      setScreen('dashboard');
    } catch (e: any) {
      setError(e.message || 'Неверный email или пароль');
    } finally {
      setFormLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !username) return;
    setFormLoading(true);
    setError('');
    try {
      const res = await authApi.register(email, username, password);
      setTokens(res.data.accessToken, res.data.refreshToken);
      setUser(res.data.user);
      await loadDashboardData();
      setScreen('dashboard');
    } catch (e: any) {
      setError(e.message || 'Ошибка регистрации');
    } finally {
      setFormLoading(false);
    }
  };

  const handleLogout = () => {
    clearTokens();
    setUser(null);
    setScreen('login');
  };

  const handleTopUp = async () => {
    setIsTopUpLoading(true);
    try {
      const response = await paymentApi.create(topUpAmount);
      window.location.href = response.data.confirmationUrl;
    } catch (error: any) {
      alert(error?.message || 'Ошибка создания платежа');
    } finally {
      setIsTopUpLoading(false);
    }
  };

  const handlePurchase = async (plan: string, price: number) => {
    if (balance < price) {
      alert(`Недостаточно средств. Нужно ${price}₽, доступно ${balance.toFixed(2)}₽`);
      return;
    }
    if (!confirm(`Купить подписку за ${price}₽?`)) return;

    setIsPurchasing(true);
    try {
      const res = await subscriptionApi.purchase(plan);
      alert(res.data.message);
      await loadDashboardData();
    } catch (e: any) {
      alert(e?.message || 'Ошибка покупки');
    } finally {
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '3px solid #7c3aed',
              borderTopColor: 'transparent',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <p style={{ color: '#a1a1aa', fontSize: '14px' }}>Загрузка...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ─── Экран логина ─────────────────────────────────────────────
  if (screen === 'login' || screen === 'register') {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#0a0a0a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <a
          href="/"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '48px',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7c3aed, #0ea5e9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 700,
              color: 'white',
            }}
          >
            V
          </div>
          <span style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff' }}>Velium</span>
        </a>

        <div
          style={{
            width: '100%',
            maxWidth: '420px',
            backgroundColor: '#141414',
            borderRadius: '20px',
            padding: '36px',
            border: '1px solid #2a2a2a',
          }}
        >
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '8px',
              textAlign: 'center',
            }}
          >
            {screen === 'login' ? 'Войти в аккаунт' : 'Создать аккаунт'}
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: '#a1a1aa',
              textAlign: 'center',
              marginBottom: '32px',
            }}
          >
            {screen === 'login'
              ? 'Единый аккаунт для всех сервисов Velium'
              : 'Один аккаунт для Pictures и VPN'}
          </p>

          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '20px',
              }}
            >
              <p style={{ color: '#ef4444', fontSize: '14px', margin: 0 }}>{error}</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid #2a2a2a',
                borderRadius: '12px',
                padding: '14px 16px',
                fontSize: '15px',
                color: '#ffffff',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />

            {screen === 'register' && (
              <input
                type="text"
                placeholder="Имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  fontSize: '15px',
                  color: '#ffffff',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              />
            )}

            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && (screen === 'login' ? handleLogin() : handleRegister())
              }
              style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid #2a2a2a',
                borderRadius: '12px',
                padding: '14px 16px',
                fontSize: '15px',
                color: '#ffffff',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />

            <button
              onClick={screen === 'login' ? handleLogin : handleRegister}
              disabled={formLoading}
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                color: 'white',
                padding: '15px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 600,
                border: 'none',
                cursor: formLoading ? 'not-allowed' : 'pointer',
                opacity: formLoading ? 0.7 : 1,
                marginTop: '8px',
              }}
            >
              {formLoading ? 'Загрузка...' : screen === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#a1a1aa' }}>
            {screen === 'login' ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
            <button
              onClick={() => {
                setScreen(screen === 'login' ? 'register' : 'login');
                setError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#a78bfa',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                padding: 0,
              }}
            >
              {screen === 'login' ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </div>
      </div>
    );
  }

  // ─── Dashboard ────────────────────────────────────────────────
  const isPremium = user?.plan === 'PREMIUM';

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <header
        style={{
          borderBottom: '1px solid #2a2a2a',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(10,10,10,0.9)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <a
          href="/"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #7c3aed, #0ea5e9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '15px',
              fontWeight: 700,
              color: 'white',
            }}
          >
            V
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>Velium</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#141414',
              borderRadius: '10px',
              padding: '8px 14px',
              border: '1px solid #2a2a2a',
            }}
          >
            <span style={{ fontSize: '14px', color: '#a1a1aa' }}>Баланс:</span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
              {balance.toFixed(2)}₽
            </span>
          </div>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #0ea5e9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '15px',
              fontWeight: 700,
              color: 'white',
              cursor: 'pointer',
            }}
          >
            {user?.username?.[0]?.toUpperCase()}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Приветствие */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
            Привет, {user?.username}! 👋
          </h1>
          <p style={{ fontSize: '15px', color: '#a1a1aa' }}>Управляй своими сервисами и балансом</p>
        </div>

        {/* Карточки */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          {/* Баланс */}
          <div
            style={{
              backgroundColor: '#141414',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #2a2a2a',
            }}
          >
            <p style={{ fontSize: '13px', color: '#a1a1aa', marginBottom: '8px' }}>Баланс</p>
            <p
              style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}
            >
              {balance.toFixed(2)}₽
            </p>

            {/* Выбор суммы */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {[100, 299, 500, 1000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setTopUpAmount(amount);
                    setCustomAmount(false);
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: topUpAmount === amount && !customAmount ? '#7c3aed' : '#2a2a2a',
                    backgroundColor:
                      topUpAmount === amount && !customAmount ? 'rgba(124,58,237,0.15)' : '#0a0a0a',
                    color: topUpAmount === amount && !customAmount ? '#a78bfa' : '#a1a1aa',
                    cursor: 'pointer',
                  }}
                >
                  {amount}₽
                </button>
              ))}
              <button
                onClick={() => setCustomAmount(true)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: customAmount ? '#7c3aed' : '#2a2a2a',
                  backgroundColor: customAmount ? 'rgba(124,58,237,0.15)' : '#0a0a0a',
                  color: customAmount ? '#a78bfa' : '#a1a1aa',
                  cursor: 'pointer',
                }}
              >
                Другая
              </button>
            </div>

            {customAmount && (
              <input
                type="number"
                placeholder="От 50₽"
                min={50}
                value={customValue}
                onChange={(e) => {
                  setCustomValue(e.target.value);
                  setTopUpAmount(parseInt(e.target.value) || 50);
                }}
                style={{
                  width: '100%',
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #7c3aed',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  color: '#ffffff',
                  outline: 'none',
                  marginBottom: '12px',
                  boxSizing: 'border-box',
                }}
              />
            )}

            <button
              onClick={handleTopUp}
              disabled={isTopUpLoading}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                color: 'white',
                padding: '11px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                cursor: isTopUpLoading ? 'not-allowed' : 'pointer',
                opacity: isTopUpLoading ? 0.7 : 1,
              }}
            >
              {isTopUpLoading ? 'Создаём платёж...' : `Пополнить на ${topUpAmount}₽`}
            </button>
          </div>

          {/* Pictures */}
          {!isPremium ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => handlePurchase('pictures_vip_month', 299)}
                disabled={isPurchasing}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: isPurchasing ? 'not-allowed' : 'pointer',
                  opacity: isPurchasing ? 0.7 : 1,
                }}
              >
                ⭐ VIP — 299₽ (50 генераций)
              </button>
              <p style={{ fontSize: '11px', color: '#52525b', textAlign: 'center' }}>
                Доп. генерации — 5₽/шт с баланса
              </p>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: 'rgba(34,197,94,0.1)',
                borderRadius: '10px',
                padding: '10px',
                textAlign: 'center',
              }}
            >
              <p style={{ color: '#22c55e', fontSize: '13px', fontWeight: 600 }}>✅ VIP активен</p>
              <p style={{ color: '#52525b', fontSize: '12px' }}>
                {user?.premiumCredits || 0} генераций осталось
              </p>
            </div>
          )}

          {/* VPN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => handlePurchase('vpn_month', 219)}
              disabled={isPurchasing}
              style={{
                width: '100%',
                textAlign: 'center',
                backgroundColor: 'rgba(14,165,233,0.15)',
                color: '#38bdf8',
                padding: '10px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                border: '1px solid rgba(14,165,233,0.3)',
                cursor: isPurchasing ? 'not-allowed' : 'pointer',
              }}
            >
              🛡️ 219₽/мес
            </button>
            <button
              onClick={() => handlePurchase('vpn_year', 1890)}
              disabled={isPurchasing}
              style={{
                width: '100%',
                textAlign: 'center',
                backgroundColor: 'rgba(14,165,233,0.1)',
                color: '#38bdf8',
                padding: '10px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                border: '1px solid rgba(14,165,233,0.2)',
                cursor: isPurchasing ? 'not-allowed' : 'pointer',
              }}
            >
              🛡️ 1890₽/год (экономия 44%)
            </button>
            <button
              onClick={() => (window.location.href = '/dashboard/vpn')}
              style={{
                width: '100%',
                textAlign: 'center',
                backgroundColor: 'rgba(14,165,233,0.15)',
                color: '#38bdf8',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                border: '1px solid rgba(14,165,233,0.3)',
                cursor: 'pointer',
              }}
            >
              🛡️ Управлять VPN устройствами
            </button>
          </div>

          {/* Профиль */}
          <div
            style={{
              backgroundColor: '#141414',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #2a2a2a',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '16px' }}>👤</span>
              <p style={{ fontSize: '13px', color: '#a1a1aa' }}>Аккаунт</p>
            </div>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
              {user?.username}
            </p>
            <p style={{ fontSize: '13px', color: '#52525b', marginBottom: '16px' }}>
              {user?.email}
            </p>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                backgroundColor: 'rgba(239,68,68,0.1)',
                color: '#ef4444',
                padding: '10px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                border: '1px solid rgba(239,68,68,0.2)',
                cursor: 'pointer',
              }}
            >
              Выйти
            </button>
          </div>
        </div>

        {/* Мои подписки */}
        <div
          style={{
            backgroundColor: '#141414',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid #2a2a2a',
            marginBottom: '24px',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '20px' }}>
            Мои подписки
          </h2>

          {user?.subscription ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                backgroundColor: '#0a0a0a',
                borderRadius: '12px',
                border: '1px solid #2a2a2a',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>🎨</span>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>
                    Velium Pictures VIP
                  </p>
                  <p style={{ fontSize: '13px', color: '#a1a1aa' }}>
                    Действует до {new Date(user.subscription.expiresAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(34,197,94,0.15)',
                    color: '#22c55e',
                    padding: '4px 12px',
                    borderRadius: '100px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  Активна
                </span>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px' }}>
              <p style={{ fontSize: '32px', marginBottom: '12px' }}>📭</p>
              <p style={{ fontSize: '15px', color: '#a1a1aa', marginBottom: '4px' }}>
                Нет активных подписок
              </p>
              <p style={{ fontSize: '13px', color: '#52525b' }}>
                Подписки появятся здесь после оплаты
              </p>
            </div>
          )}
        </div>

        {/* История транзакций */}
        <div
          style={{
            backgroundColor: '#141414',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid #2a2a2a',
          }}
        >
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '20px' }}>
            История операций
          </h2>

          {transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px' }}>
              <p style={{ fontSize: '32px', marginBottom: '12px' }}>📋</p>
              <p style={{ fontSize: '15px', color: '#a1a1aa', marginBottom: '4px' }}>
                История пуста
              </p>
              <p style={{ fontSize: '13px', color: '#52525b' }}>
                Все операции с балансом отобразятся здесь
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    backgroundColor: '#0a0a0a',
                    borderRadius: '12px',
                    border: '1px solid #2a2a2a',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>
                      {tx.type === 'DEPOSIT'
                        ? '💳'
                        : tx.type === 'SUBSCRIPTION'
                          ? '⭐'
                          : tx.type === 'GENERATION'
                            ? '🎨'
                            : '💸'}
                    </span>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>
                        {tx.description}
                      </p>
                      <p
                        style={{
                          fontSize: '12px',
                          color:
                            tx.status === 'PENDING'
                              ? '#f59e0b'
                              : tx.status === 'FAILED' || tx.status === 'CANCELLED'
                                ? '#ef4444'
                                : '#22c55e',
                        }}
                      >
                        {tx.status === 'PENDING'
                          ? '⏳ Ожидает оплаты'
                          : tx.status === 'SUCCEEDED'
                            ? '✅ Выполнено'
                            : '❌ Отменено'}
                      </p>
                      <p style={{ fontSize: '12px', color: '#52525b' }}></p>
                      <p style={{ fontSize: '12px', color: '#52525b' }}>
                        {new Date(tx.createdAt).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color:
                        tx.status === 'PENDING'
                          ? '#f59e0b'
                          : tx.type === 'DEPOSIT'
                            ? '#22c55e'
                            : '#ef4444',
                    }}
                  >
                    {tx.status === 'PENDING' ? '' : tx.type === 'DEPOSIT' ? '+' : '-'}
                    {Math.abs(tx.amount)}₽
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

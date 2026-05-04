'use client';
import { useEffect, useState } from 'react';
import { getToken, clearTokens } from '../dashboard/auth';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!getToken());
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        borderBottom: '1px solid #2a2a2a',
        backgroundColor: 'rgba(10,10,10,0.85)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <a
          href="/"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #7c3aed, #0ea5e9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              color: 'white',
              fontWeight: 700,
            }}
          >
            V
          </div>
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>Velium</span>
        </a>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a
            href="#services"
            style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '15px' }}
          >
            Сервисы
          </a>
          <a href="#pricing" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '15px' }}>
            Тарифы
          </a>
          {isLoggedIn ? (
            <a
              href="/dashboard"
              style={{
                backgroundColor: '#7c3aed',
                color: 'white',
                padding: '9px 20px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              Личный кабинет
            </a>
          ) : (
            <a
              href="/dashboard"
              style={{
                backgroundColor: '#7c3aed',
                color: 'white',
                padding: '9px 20px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              Войти
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}

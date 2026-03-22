export default function Home() {
  const features = [
    { icon: '⚡', title: 'Быстрая генерация', desc: 'Получайте изображения за 5-15 секунд.' },
    { icon: '💬', title: 'Чат-интерфейс', desc: 'Привычный интерфейс как в мессенджере.' },
    { icon: '🎨', title: 'Stable Diffusion', desc: 'Мощная модель для реалистичных изображений.' },
    { icon: '🖼️', title: 'Галерея работ', desc: 'Все изображения сохраняются в галерее.' },
    { icon: '🔒', title: 'Приватность', desc: 'Твои изображения принадлежат только тебе.' },
    {
      icon: '🇷🇺',
      title: 'Серверы в России',
      desc: 'Никаких блокировок для российских пользователей.',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          borderBottom: '1px solid #2a2a2a',
          backgroundColor: 'rgba(10,10,10,0.8)',
          backdropFilter: 'blur(12px)',
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
          <span style={{ fontSize: '20px', fontWeight: 700 }}>✨ Velium Pictures</span>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <a
              href="#features"
              style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '15px' }}
            >
              Возможности
            </a>
            <a
              href="#pricing"
              style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '15px' }}
            >
              Тарифы
            </a>
            <a
              href="#download"
              style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '15px' }}
            >
              Скачать
            </a>
            <a
              href="#download"
              style={{
                backgroundColor: '#7c3aed',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: 600,
              }}
            >
              Скачать бесплатно
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '120px 24px 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '100px',
            padding: '6px 16px',
            marginBottom: '32px',
            fontSize: '14px',
            color: '#a78bfa',
          }}
        >
          ✨ Powered by Stable Diffusion
        </div>
        <h1
          style={{
            fontSize: 'clamp(40px, 7vw, 80px)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '24px',
            maxWidth: '800px',
            letterSpacing: '-2px',
          }}
        >
          {'Создавай изображения '}
          <span
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            силой мысли
          </span>
        </h1>
        <p
          style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: '#a1a1aa',
            maxWidth: '560px',
            lineHeight: 1.7,
            marginBottom: '48px',
          }}
        >
          Просто опиши что хочешь увидеть — Velium Pictures создаст уникальное изображение за
          секунды
        </p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a
            href="#download"
            style={{
              backgroundColor: '#7c3aed',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            📱 Скачать для Android
          </a>
          <a
            href="#pricing"
            style={{
              backgroundColor: '#141414',
              color: '#ffffff',
              padding: '16px 32px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 600,
              border: '1px solid #2a2a2a',
            }}
          >
            Посмотреть тарифы
          </a>
        </div>

        {/* Phone mockup */}
        <div
          style={{
            marginTop: '80px',
            width: '280px',
            height: '520px',
            backgroundColor: '#141414',
            borderRadius: '40px',
            border: '2px solid #2a2a2a',
            overflow: 'hidden',
            boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
          }}
        >
          <div
            style={{
              height: '56px',
              backgroundColor: '#0a0a0a',
              borderBottom: '1px solid #2a2a2a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontWeight: 700, fontSize: '15px' }}>✨ Velium Pictures</span>
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                alignSelf: 'flex-end',
                backgroundColor: '#7c3aed',
                borderRadius: '18px 18px 4px 18px',
                padding: '10px 14px',
                maxWidth: '80%',
              }}
            >
              <p style={{ color: 'white', fontSize: '13px', margin: 0 }}>
                Закат над горами, фотореализм
              </p>
            </div>
            <div
              style={{
                alignSelf: 'flex-start',
                width: '180px',
                height: '180px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(167,139,250,0.2))',
                border: '1px solid #2a2a2a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
              }}
            >
              🌄
            </div>
            <div
              style={{
                alignSelf: 'flex-end',
                backgroundColor: '#7c3aed',
                borderRadius: '18px 18px 4px 18px',
                padding: '10px 14px',
                maxWidth: '80%',
              }}
            >
              <p style={{ color: 'white', fontSize: '13px', margin: 0 }}>
                Космический кит в галактике
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        style={{ padding: '100px 24px', maxWidth: '1200px', margin: '0 auto' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2
            style={{
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 800,
              marginBottom: '16px',
              letterSpacing: '-1px',
            }}
          >
            Всё что нужно для творчества
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: '#a1a1aa',
              maxWidth: '480px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Velium Pictures создан чтобы генерация изображений была простой и приятной
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                backgroundColor: '#141414',
                borderRadius: '16px',
                padding: '28px',
                border: '1px solid #2a2a2a',
              }}
            >
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>{f.title}</h3>
              <p style={{ fontSize: '15px', color: '#a1a1aa', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '100px 24px', backgroundColor: '#141414' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2
              style={{
                fontSize: 'clamp(32px, 4vw, 48px)',
                fontWeight: 800,
                marginBottom: '16px',
                letterSpacing: '-1px',
              }}
            >
              Простые тарифы
            </h2>
            <p style={{ fontSize: '18px', color: '#a1a1aa', lineHeight: 1.7 }}>
              Начни бесплатно, перейди на Premium когда будешь готов
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            {/* Free */}
            <div
              style={{
                backgroundColor: '#0a0a0a',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid #2a2a2a',
              }}
            >
              <p style={{ color: '#a1a1aa', fontSize: '14px', marginBottom: '8px' }}>БЕСПЛАТНО</p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '4px',
                  marginBottom: '24px',
                }}
              >
                <span style={{ fontSize: '48px', fontWeight: 800 }}>0₽</span>
                <span style={{ color: '#a1a1aa' }}>/мес</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  marginBottom: '32px',
                }}
              >
                {[
                  '5 генераций в день',
                  'Разрешение до 512×512',
                  'Галерея изображений',
                  'Сохранение истории',
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '15px',
                      color: '#a1a1aa',
                    }}
                  >
                    <span style={{ color: '#22c55e' }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>
              <a
                href="#download"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  backgroundColor: '#1e1e1e',
                  color: '#ffffff',
                  padding: '14px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: 600,
                  border: '1px solid #2a2a2a',
                }}
              >
                Скачать бесплатно
              </a>
            </div>

            {/* Premium */}
            <div
              style={{
                backgroundColor: '#0a0a0a',
                borderRadius: '20px',
                padding: '32px',
                border: '2px solid #7c3aed',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  padding: '4px 16px',
                  borderRadius: '100px',
                  fontSize: '13px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                ⭐ Популярный
              </div>
              <p style={{ color: '#a78bfa', fontSize: '14px', marginBottom: '8px' }}>PREMIUM</p>
              <div
                style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}
              >
                <span style={{ fontSize: '48px', fontWeight: 800 }}>299₽</span>
                <span style={{ color: '#a1a1aa' }}>/мес</span>
              </div>
              <p style={{ color: '#a1a1aa', fontSize: '13px', marginBottom: '24px' }}>
                или 1 990₽/год — экономия 44%
              </p>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  marginBottom: '32px',
                }}
              >
                {[
                  'Безлимитные генерации',
                  'Разрешение до 1024×1024',
                  'Приоритетная очередь',
                  'Галерея изображений',
                  'Сохранение истории',
                  'Поддержка 24/7',
                ].map((item) => (
                  <div
                    key={item}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}
                  >
                    <span style={{ color: '#22c55e' }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>
              <button
                disabled
                style={{
                  display: 'block',
                  width: '100%',
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'not-allowed',
                  opacity: 0.7,
                }}
              >
                Скоро — оплата через сайт
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Download */}
      <section
        id="download"
        style={{ padding: '100px 24px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}
      >
        <h2
          style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 800,
            marginBottom: '16px',
            letterSpacing: '-1px',
          }}
        >
          Начни создавать прямо сейчас
        </h2>
        <p style={{ fontSize: '18px', color: '#a1a1aa', marginBottom: '48px', lineHeight: 1.7 }}>
          Доступно для Android. iOS — скоро.
        </p>
        <div
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '24px',
          }}
        >
          <a
            href="#"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#141414',
              border: '1px solid #2a2a2a',
              borderRadius: '14px',
              padding: '14px 24px',
              textDecoration: 'none',
              color: '#ffffff',
            }}
          >
            <span style={{ fontSize: '28px' }}>▶</span>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '11px', color: '#a1a1aa', margin: 0 }}>Скачать в</p>
              <p style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Google Play</p>
            </div>
          </a>
          <a
            href="#"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#141414',
              border: '1px solid #2a2a2a',
              borderRadius: '14px',
              padding: '14px 24px',
              textDecoration: 'none',
              color: '#ffffff',
            }}
          >
            <span style={{ fontSize: '28px' }}>📦</span>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: '11px', color: '#a1a1aa', margin: 0 }}>Прямая загрузка</p>
              <p style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>APK файл</p>
            </div>
          </a>
        </div>
        <p style={{ color: '#52525b', fontSize: '14px' }}>
          Бесплатно • Без рекламы • 5 генераций в день
        </p>
      </section>

      {/* Footer */}
      <footer
        style={{ borderTop: '1px solid #2a2a2a', padding: '48px 24px', backgroundColor: '#141414' }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '32px',
            }}
          >
            <div style={{ maxWidth: '300px' }}>
              <p style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>
                ✨ Velium Pictures
              </p>
              <p style={{ color: '#a1a1aa', fontSize: '14px', lineHeight: 1.7 }}>
                Генерация изображений с помощью искусственного интеллекта.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontWeight: 600, marginBottom: '16px', fontSize: '14px' }}>
                  Приложение
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { label: 'Возможности', href: '#features' },
                    { label: 'Тарифы', href: '#pricing' },
                    { label: 'Скачать', href: '#download' },
                  ].map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px' }}
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontWeight: 600, marginBottom: '16px', fontSize: '14px' }}>Документы</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { label: 'Пользовательское соглашение', href: '/legal/terms' },
                    { label: 'Политика конфиденциальности', href: '/legal/privacy' },
                    { label: 'Удаление аккаунта', href: '/legal/delete-account' },
                    { label: 'Оферта', href: '/legal/offer' },
                  ].map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px' }}
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              borderTop: '1px solid #2a2a2a',
              paddingTop: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <p style={{ color: '#52525b', fontSize: '14px' }}>
              © 2026 Velium Pictures. Все права защищены.
            </p>
            <p style={{ color: '#52525b', fontSize: '14px' }}>Сделано в России 🇷🇺</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

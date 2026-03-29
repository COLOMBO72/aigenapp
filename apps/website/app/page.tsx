export default function Home() {
  const services = [
    {
      icon: '🎨',
      name: 'Velium Pictures',
      tag: 'ИИ генерация изображений',
      desc: 'Создавай уникальные изображения по текстовому описанию. Два режима — быстрый бесплатный и премиум с высоким качеством.',
      color: '#7c3aed',
      colorLight: 'rgba(124,58,237,0.15)',
      colorBorder: 'rgba(124,58,237,0.3)',
      href: '/services/pictures',
      plans: ['5 бесплатных генераций/день', '50 Premium генераций в подписке', '5₽ за доп. Premium генерацию'],
    },
    {
      icon: '🛡️',
      name: 'Velium VPN',
      tag: 'Безопасный VPN сервис',
      desc: 'Надёжная защита соединения и доступ к любым сайтам. Серверы в нескольких странах, без логов.',
      color: '#0ea5e9',
      colorLight: 'rgba(14,165,233,0.15)',
      colorBorder: 'rgba(14,165,233,0.3)',
      href: '/services/vpn',
      plans: ['Бесплатный период 7 дней', 'Подписка 199₽/мес', 'Годовой план 1 490₽/год'],
    },
  ];

  const features = [
    { icon: '💰', title: 'Единый баланс', desc: 'Пополни баланс один раз и используй для любых сервисов — Pictures и VPN.' },
    { icon: '🔄', title: 'Автопродление', desc: 'Настрой автоматическое продление подписки — никогда не потеряешь доступ.' },
    { icon: '👤', title: 'Один аккаунт', desc: 'Один аккаунт для всех сервисов Velium. Регистрация один раз.' },
    { icon: '🇷🇺', title: 'Для России', desc: 'Все сервисы работают без VPN, серверы в России, оплата через ЮКассу.' },
    { icon: '⚡', title: 'Мгновенный доступ', desc: 'Подписка активируется автоматически сразу после оплаты.' },
    { icon: '🔒', title: 'Безопасность', desc: 'Данные защищены шифрованием. Мы не продаём информацию о пользователях.' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}>

      {/* Header */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, borderBottom: '1px solid #2a2a2a', backgroundColor: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(16px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #7c3aed, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>V</div>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>Velium</span>
          </a>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <a href="#services" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '15px' }}>Сервисы</a>
            <a href="#pricing" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '15px' }}>Тарифы</a>
            <a href="#features" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '15px' }}>Преимущества</a>
            <a href="/dashboard" style={{ backgroundColor: '#7c3aed', color: 'white', padding: '9px 20px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>Войти</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '20%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '15%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '100px', padding: '6px 16px', marginBottom: '32px', fontSize: '13px', color: '#a78bfa' }}>
          🚀 Единая экосистема цифровых сервисов
        </div>

        <h1 style={{ fontSize: 'clamp(42px, 7vw, 84px)', fontWeight: 800, lineHeight: 1.05, marginBottom: '24px', maxWidth: '900px', letterSpacing: '-3px' }}>
          {'Все сервисы '}
          <span style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #0ea5e9 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            в одном месте
          </span>
        </h1>

        <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#a1a1aa', maxWidth: '580px', lineHeight: 1.7, marginBottom: '48px' }}>
          Velium — платформа с единым аккаунтом и балансом. ИИ генерация изображений, VPN и многое другое.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '80px' }}>
          <a href="#services" style={{ background: 'linear-gradient(135deg, #7c3aed, #0ea5e9)', color: 'white', padding: '16px 32px', borderRadius: '12px', textDecoration: 'none', fontSize: '16px', fontWeight: 600 }}>
            Смотреть сервисы
          </a>
          <a href="/dashboard" style={{ backgroundColor: '#141414', color: '#ffffff', padding: '16px 32px', borderRadius: '12px', textDecoration: 'none', fontSize: '16px', fontWeight: 600, border: '1px solid #2a2a2a' }}>
            Войти в аккаунт
          </a>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { value: '2', label: 'Сервиса' },
            { value: '1', label: 'Аккаунт' },
            { value: '∞', label: 'Возможностей' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '36px', fontWeight: 800, background: 'linear-gradient(135deg, #7c3aed, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stat.value}</p>
              <p style={{ fontSize: '14px', color: '#52525b', marginTop: '4px' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" style={{ padding: '100px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, marginBottom: '16px', letterSpacing: '-1px' }}>
            Наши сервисы
          </h2>
          <p style={{ fontSize: '18px', color: '#a1a1aa', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            Один аккаунт и единый баланс для всего
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {services.map((service) => (
            <div key={service.name} style={{ backgroundColor: '#141414', borderRadius: '20px', padding: '32px', border: '1px solid #2a2a2a', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', backgroundColor: service.colorLight, border: `1px solid ${service.colorBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                  {service.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '2px' }}>{service.name}</h3>
                  <p style={{ fontSize: '13px', color: service.color, fontWeight: 500 }}>{service.tag}</p>
                </div>
              </div>

              <p style={{ fontSize: '15px', color: '#a1a1aa', lineHeight: 1.7 }}>{service.desc}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {service.plans.map((plan) => (
                  <div key={plan} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#a1a1aa' }}>
                    <span style={{ color: '#22c55e', fontSize: '12px' }}>✓</span>{plan}
                  </div>
                ))}
              </div>

              <a href={service.href} style={{ display: 'block', textAlign: 'center', backgroundColor: service.colorLight, color: service.color, padding: '13px', borderRadius: '12px', textDecoration: 'none', fontSize: '15px', fontWeight: 600, border: `1px solid ${service.colorBorder}`, marginTop: 'auto' }}>
                Подробнее →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '100px 24px', backgroundColor: '#0d0d0d' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, marginBottom: '16px', letterSpacing: '-1px' }}>
              Тарифы
            </h2>
            <p style={{ fontSize: '18px', color: '#a1a1aa', lineHeight: 1.7 }}>
              Пополни баланс и используй на любой сервис
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>

            {/* Pictures Free */}
            <div style={{ backgroundColor: '#141414', borderRadius: '20px', padding: '28px', border: '1px solid #2a2a2a' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>🎨</div>
              <p style={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Pictures Free</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '20px' }}>
                <span style={{ fontSize: '40px', fontWeight: 800 }}>0₽</span>
                <span style={{ color: '#a1a1aa', fontSize: '14px' }}>/мес</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {['5 генераций/день (Flux Schnell)', 'Разрешение 512×512', 'Галерея изображений'].map((i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '14px', color: '#a1a1aa' }}>
                    <span style={{ color: '#22c55e' }}>✓</span>{i}
                  </div>
                ))}
              </div>
              <a href="#" style={{ display: 'block', textAlign: 'center', backgroundColor: '#1e1e1e', color: '#fff', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 600, border: '1px solid #2a2a2a' }}>
                Скачать бесплатно
              </a>
            </div>

            {/* Pictures VIP */}
            <div style={{ backgroundColor: '#141414', borderRadius: '20px', padding: '28px', border: '2px solid #7c3aed', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#7c3aed', color: 'white', padding: '3px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                ⭐ Популярный
              </div>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>🎨</div>
              <p style={{ color: '#a78bfa', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Pictures VIP</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                <span style={{ fontSize: '40px', fontWeight: 800 }}>299₽</span>
                <span style={{ color: '#a1a1aa', fontSize: '14px' }}>/мес</span>
              </div>
              <p style={{ color: '#52525b', fontSize: '12px', marginBottom: '20px' }}>или 1 990₽/год</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {['Безлимит на Flux Schnell', '50 Premium генераций/мес', 'Доп. генерации — 5₽/шт', 'Разрешение 1024×1024', 'Приоритетная очередь'].map((i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '14px', color: '#fff' }}>
                    <span style={{ color: '#22c55e' }}>✓</span>{i}
                  </div>
                ))}
              </div>
              <button disabled style={{ width: '100%', backgroundColor: '#7c3aed', color: 'white', padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'not-allowed', opacity: 0.7 }}>
                Скоро
              </button>
            </div>

            {/* VPN */}
            <div style={{ backgroundColor: '#141414', borderRadius: '20px', padding: '28px', border: '1px solid #2a2a2a' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>🛡️</div>
              <p style={{ color: '#38bdf8', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Velium VPN</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                <span style={{ fontSize: '40px', fontWeight: 800 }}>199₽</span>
                <span style={{ color: '#a1a1aa', fontSize: '14px' }}>/мес</span>
              </div>
              <p style={{ color: '#52525b', fontSize: '12px', marginBottom: '20px' }}>или 1 490₽/год</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {['7 дней бесплатно', 'Серверы в 10+ странах', 'Без логов', 'Безлимитный трафик', 'До 5 устройств'].map((i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '14px', color: '#a1a1aa' }}>
                    <span style={{ color: '#22c55e' }}>✓</span>{i}
                  </div>
                ))}
              </div>
              <button disabled style={{ width: '100%', backgroundColor: '#0ea5e9', color: 'white', padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'not-allowed', opacity: 0.7 }}>
                Скоро
              </button>
            </div>
          </div>

          {/* Balance info */}
          <div style={{ maxWidth: '700px', margin: '48px auto 0', backgroundColor: '#141414', borderRadius: '16px', padding: '28px', border: '1px solid #2a2a2a', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '32px' }}>💡</span>
            <div>
              <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Как работает единый баланс</p>
              <p style={{ fontSize: '14px', color: '#a1a1aa', lineHeight: 1.7 }}>
                Пополни баланс через ЮКассу и используй средства на любой сервис. Настрой автопродление подписки и дополнительные генерации спишутся автоматически с баланса по 5₽/шт.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '100px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, marginBottom: '16px', letterSpacing: '-1px' }}>
            Почему Velium
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {features.map((f) => (
            <div key={f.title} style={{ backgroundColor: '#141414', borderRadius: '16px', padding: '24px', border: '1px solid #2a2a2a' }}>
              <div style={{ fontSize: '28px', marginBottom: '14px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ fontSize: '14px', color: '#a1a1aa', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 24px', textAlign: 'center', background: 'linear-gradient(180deg, #0a0a0a 0%, #0d0b1a 100%)' }}>
        <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, marginBottom: '20px', letterSpacing: '-1px' }}>
          Готов начать?
        </h2>
        <p style={{ fontSize: '18px', color: '#a1a1aa', marginBottom: '40px', lineHeight: 1.7 }}>
          Зарегистрируйся и получи доступ ко всем сервисам Velium
        </p>
        <a href="/dashboard" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #7c3aed, #0ea5e9)', color: 'white', padding: '18px 40px', borderRadius: '14px', textDecoration: 'none', fontSize: '17px', fontWeight: 700 }}>
          Создать аккаунт бесплатно
        </a>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #2a2a2a', padding: '48px 24px', backgroundColor: '#0d0d0d' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '32px' }}>
            <div style={{ maxWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'linear-gradient(135deg, #7c3aed, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>V</div>
                <span style={{ fontSize: '17px', fontWeight: 700 }}>Velium</span>
              </div>
              <p style={{ color: '#a1a1aa', fontSize: '14px', lineHeight: 1.7 }}>
                Единая платформа цифровых сервисов. ИИ генерация изображений и VPN в одном месте.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontWeight: 600, marginBottom: '16px', fontSize: '14px' }}>Сервисы</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[{ l: 'Velium Pictures', h: '/services/pictures' }, { l: 'Velium VPN', h: '/services/vpn' }, { l: 'Тарифы', h: '#pricing' }].map((x) => (
                    <a key={x.h} href={x.h} style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px' }}>{x.l}</a>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontWeight: 600, marginBottom: '16px', fontSize: '14px' }}>Аккаунт</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[{ l: 'Войти', h: '/dashboard' }, { l: 'Регистрация', h: '/dashboard' }, { l: 'Баланс', h: '/dashboard' }].map((x) => (
                    <a key={x.l} href={x.h} style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px' }}>{x.l}</a>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontWeight: 600, marginBottom: '16px', fontSize: '14px' }}>Документы</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { l: 'Соглашение', h: '/legal/terms' },
                    { l: 'Конфиденциальность', h: '/legal/privacy' },
                    { l: 'Удаление аккаунта', h: '/legal/delete-account' },
                    { l: 'Оферта', h: '/legal/offer' },
                  ].map((x) => (
                    <a key={x.h} href={x.h} style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px' }}>{x.l}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <p style={{ color: '#52525b', fontSize: '14px' }}>© 2026 Velium. Все права защищены.</p>
            <p style={{ color: '#52525b', fontSize: '14px' }}>Сделано в России 🇷🇺</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
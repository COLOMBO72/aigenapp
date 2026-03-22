export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif' }}>
      <header style={{ borderBottom: '1px solid #2a2a2a', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(10,10,10,0.8)' }}>
        <a href="/" style={{ textDecoration: 'none', color: '#ffffff', fontSize: '18px', fontWeight: 700 }}>
          ✨ Velium Pictures
        </a>
        <a href="/" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px' }}>
          ← На главную
        </a>
      </header>
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px' }}>
        {children}
      </main>
    </div>
  );
}
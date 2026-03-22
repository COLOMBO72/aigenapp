interface Section {
  title: string;
  items: string[];
}

interface LegalPageProps {
  title: string;
  subtitle: string;
  updatedAt: string;
  intro: string;
  sections: Section[];
}

export default function LegalPage({ title, subtitle, updatedAt, intro, sections }: LegalPageProps) {
  return (
    <div>
      <div style={{ marginBottom: '48px', paddingBottom: '32px', borderBottom: '1px solid #2a2a2a' }}>
        <p style={{ color: '#7c3aed', fontSize: '14px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {subtitle}
        </p>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginBottom: '12px', letterSpacing: '-1px' }}>
          {title}
        </h1>
        <p style={{ color: '#52525b', fontSize: '14px' }}>
          Последнее обновление: {updatedAt}
        </p>
      </div>

      <p style={{ fontSize: '16px', color: '#a1a1aa', lineHeight: 1.8, marginBottom: '48px' }}>
        {intro}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {sections.map((section, i) => (
          <div key={i}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', color: '#ffffff' }}>
              {section.title}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {section.items.map((item, j) => (
                <p key={j} style={{ fontSize: '15px', color: '#a1a1aa', lineHeight: 1.8, paddingLeft: '16px', borderLeft: '2px solid #2a2a2a' }}>
                  {item}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
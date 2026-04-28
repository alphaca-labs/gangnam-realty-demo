import type { ReactNode } from 'react';

type Accent = 'brand' | 'warm' | 'ok';

interface RichCardProps {
  icon?: ReactNode;
  label?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  accent?: Accent;
}

const accentMap: Record<Accent, { bg: string; ink: string }> = {
  brand: { bg: 'var(--brand-soft)', ink: 'var(--brand-ink)' },
  warm: { bg: 'var(--warm-soft)', ink: 'var(--warm-ink)' },
  ok: { bg: 'var(--ok-soft)', ink: 'oklch(35% 0.1 155)' },
};

export function RichCard({ icon, label, children, footer, accent = 'brand' }: RichCardProps) {
  const a = accentMap[accent];
  return (
    <div
      style={{
        background: 'white',
        border: '1px solid var(--line)',
        borderRadius: '4px 16px 16px 16px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-1)',
      }}
    >
      {label ? (
        <div
          style={{
            padding: '10px 16px',
            background: a.bg,
            color: a.ink,
            fontSize: 12,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            letterSpacing: '-0.01em',
            borderBottom: '1px solid var(--line)',
          }}
        >
          {icon}
          <span>{label}</span>
        </div>
      ) : null}
      <div>{children}</div>
      {footer ? (
        <div
          style={{
            padding: '10px 14px',
            borderTop: '1px solid var(--line)',
            background: 'var(--paper-2)',
            display: 'flex',
            gap: 8,
            justifyContent: 'flex-end',
          }}
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}

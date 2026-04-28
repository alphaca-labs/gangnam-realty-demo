import type { ReactNode } from 'react';

interface UserBubbleProps {
  children: ReactNode;
  time?: string;
}

export function UserBubble({ children, time }: UserBubbleProps) {
  return (
    <div className="rise" style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '100%' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 6,
          maxWidth: '78%',
        }}
      >
        <div
          style={{
            background: 'var(--brand)',
            color: 'white',
            borderRadius: '16px 4px 16px 16px',
            padding: '12px 16px',
            fontSize: 15,
            lineHeight: 1.55,
            letterSpacing: '-0.01em',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {children}
        </div>
        {time ? <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>{time}</div> : null}
      </div>
    </div>
  );
}

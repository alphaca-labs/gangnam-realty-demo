import type { ReactNode } from 'react';

interface AITextProps {
  children: ReactNode;
}

export function AIText({ children }: AITextProps) {
  return (
    <div
      style={{
        background: 'white',
        border: '1px solid var(--line)',
        borderRadius: '4px 16px 16px 16px',
        padding: '14px 18px',
        fontSize: 15,
        lineHeight: 1.65,
        color: 'var(--ink)',
        letterSpacing: '-0.01em',
        boxShadow: 'var(--shadow-1)',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
    >
      {children}
    </div>
  );
}

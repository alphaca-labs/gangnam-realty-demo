import type { ReactNode } from 'react';
import { Avatar } from './Avatar';

interface AIBubbleProps {
  children: ReactNode;
  time?: string;
}

export function AIBubble({ children, time }: AIBubbleProps) {
  return (
    <div className="rise" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', maxWidth: '92%' }}>
      <Avatar kind="ai" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 500, paddingLeft: 2 }}>
          AI 어시스턴트{time ? <span style={{ color: 'var(--ink-4)', marginLeft: 6 }}>{time}</span> : null}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

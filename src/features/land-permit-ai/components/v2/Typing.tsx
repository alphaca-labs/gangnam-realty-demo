import { Avatar } from './Avatar';

export function Typing() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <Avatar kind="ai" />
      <div
        style={{
          background: 'white',
          border: '1px solid var(--line)',
          borderRadius: '4px 16px 16px 16px',
          padding: '14px 18px',
          width: 'fit-content',
          boxShadow: 'var(--shadow-1)',
        }}
      >
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}

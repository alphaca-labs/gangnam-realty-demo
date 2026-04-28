import { Icons } from './Icons';

interface AvatarProps {
  kind?: 'ai' | 'user';
  size?: number;
}

export function Avatar({ kind = 'ai', size = 32 }: AvatarProps) {
  if (kind === 'ai') {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 999,
          background: 'var(--paper-2)',
          border: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--brand-ink)',
          flexShrink: 0,
        }}
      >
        <Icons.spark size={Math.round(size * 0.5)} stroke={1.8} />
      </div>
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: 'var(--ink)',
        color: 'var(--paper)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      나
    </div>
  );
}

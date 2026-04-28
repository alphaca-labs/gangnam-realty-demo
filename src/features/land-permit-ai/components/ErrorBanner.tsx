'use client';

import { Icons } from './v2/Icons';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorBanner({ message, onRetry, onDismiss }: ErrorBannerProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        borderRadius: 12,
        border: '1px solid oklch(82% 0.14 30 / 0.5)',
        background: 'oklch(95% 0.04 30)',
        padding: '10px 12px',
        fontSize: 13,
        color: 'oklch(38% 0.14 30)',
      }}
    >
      <Icons.alert size={16} />
      <p style={{ margin: 0, flex: 1, lineHeight: 1.5 }}>{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="btn btn-ghost"
          style={{ padding: '4px 10px', fontSize: 12 }}
        >
          <Icons.refresh size={12} /> 다시 시도
        </button>
      ) : null}
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="닫기"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            padding: 4,
            display: 'inline-flex',
          }}
        >
          <Icons.close size={14} />
        </button>
      ) : null}
    </div>
  );
}

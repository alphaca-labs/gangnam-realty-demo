import type { ReactNode } from 'react';

interface IconProps {
  size?: number;
  stroke?: number;
  fill?: string;
  className?: string;
  children?: ReactNode;
}

function BaseIcon({ size = 18, stroke = 1.6, fill = 'none', className, children }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

type IconRenderProps = {
  size?: number;
  stroke?: number;
  className?: string;
};

export const Icons = {
  send: (p: IconRenderProps = {}) => (
    <BaseIcon {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </BaseIcon>
  ),
  plus: (p: IconRenderProps = {}) => (
    <BaseIcon {...p}>
      <path d="M12 5v14M5 12h14" />
    </BaseIcon>
  ),
  attach: (p: IconRenderProps = {}) => (
    <BaseIcon {...p}>
      <path d="M21 11.5l-8.5 8.5a5 5 0 1 1-7-7L14 4.5a3.5 3.5 0 1 1 5 5L10.5 18a2 2 0 0 1-3-3L15 7.5" />
    </BaseIcon>
  ),
  mic: (p: IconRenderProps = {}) => (
    <BaseIcon {...p}>
      <rect x="9" y="3" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </BaseIcon>
  ),
  pin: (p: IconRenderProps = {}) => (
    <BaseIcon {...p}>
      <path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z" />
      <circle cx="12" cy="9" r="2.5" />
    </BaseIcon>
  ),
  doc: (p: IconRenderProps = {}) => (
    <BaseIcon {...p}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </BaseIcon>
  ),
  check: (p: IconRenderProps = {}) => (
    <BaseIcon {...p}>
      <path d="M5 13l4 4L19 7" />
    </BaseIcon>
  ),
  user: (p: IconRenderProps = {}) => (
    <BaseIcon {...p}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </BaseIcon>
  ),
  card: (p: IconRenderProps = {}) => (
    <BaseIcon {...p}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18M7 15h4" />
    </BaseIcon>
  ),
  arrowRight: (p: IconRenderProps = {}) => (
    <BaseIcon {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </BaseIcon>
  ),
  shield: (p: IconRenderProps = {}) => (
    <BaseIcon {...p}>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
    </BaseIcon>
  ),
  spark: (p: IconRenderProps = {}) => (
    <BaseIcon {...p}>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </BaseIcon>
  ),
  download: (p: IconRenderProps = {}) => (
    <BaseIcon {...p}>
      <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
    </BaseIcon>
  ),
  copy: (p: IconRenderProps = {}) => (
    <BaseIcon {...p}>
      <rect x="8" y="8" width="13" height="13" rx="2" />
      <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
    </BaseIcon>
  ),
  edit: (p: IconRenderProps = {}) => (
    <BaseIcon {...p}>
      <path d="M4 20h4l10-10-4-4L4 16v4zM14 6l4 4" />
    </BaseIcon>
  ),
  search: (p: IconRenderProps = {}) => (
    <BaseIcon {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.5-4.5" />
    </BaseIcon>
  ),
  clip: (p: IconRenderProps = {}) => (
    <BaseIcon {...p}>
      <rect x="7" y="3" width="10" height="4" rx="1" />
      <path d="M5 7h14v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7z" />
    </BaseIcon>
  ),
  menu: (p: IconRenderProps = {}) => (
    <BaseIcon {...p}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </BaseIcon>
  ),
  close: (p: IconRenderProps = {}) => (
    <BaseIcon {...p}>
      <path d="M6 6l12 12M18 6L6 18" />
    </BaseIcon>
  ),
  qr: (p: IconRenderProps = {}) => (
    <BaseIcon {...p}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3M21 14v3M14 21h7M17 18h4" />
    </BaseIcon>
  ),
  refresh: (p: IconRenderProps = {}) => (
    <BaseIcon {...p}>
      <path d="M3 12a9 9 0 0 1 15.7-6L21 8M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15.7 6L3 16M3 21v-5h5" />
    </BaseIcon>
  ),
  alert: (p: IconRenderProps = {}) => (
    <BaseIcon {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" />
    </BaseIcon>
  ),
};

export type IconKey = keyof typeof Icons;

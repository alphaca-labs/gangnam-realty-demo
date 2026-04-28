import { Icons } from './Icons';

interface NoticeBannerProps {
  density?: 'standard' | 'minimal';
}

export function NoticeBanner({ density = 'standard' }: NoticeBannerProps) {
  if (density === 'minimal') {
    return (
      <div
        style={{
          padding: '8px 14px',
          fontSize: 11,
          color: 'var(--warm-ink)',
          background: 'var(--warm-soft)',
          borderBottom: '1px solid oklch(85% 0.06 75)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Icons.shield size={12} />
        <span>입력하신 정보는 신청 목적으로만 사용됩니다</span>
      </div>
    );
  }
  return (
    <div
      style={{
        padding: '12px 20px',
        background: 'var(--warm-soft)',
        borderBottom: '1px solid oklch(85% 0.06 75)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        color: 'var(--warm-ink)',
        fontSize: 13,
        fontWeight: 500,
      }}
    >
      <Icons.shield size={16} />
      <span>
        입력하신 개인정보는 신청서 작성 목적으로만 사용되며, 주민번호 등 민감정보는 자동 마스킹됩니다.
      </span>
    </div>
  );
}

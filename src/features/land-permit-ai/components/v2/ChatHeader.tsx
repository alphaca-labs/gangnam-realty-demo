'use client';

import { Icons } from './Icons';

interface ChatHeaderProps {
  onMenuClick?: () => void;
  ready?: boolean;
}

export function ChatHeader({ onMenuClick, ready = true }: ChatHeaderProps) {
  return (
    <header
      style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--line)',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="메뉴 열기"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--ink-2)',
          padding: 6,
          display: 'inline-flex',
        }}
        className="lp-menu-btn"
      >
        <Icons.menu size={20} />
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <h1
            style={{
              margin: 0,
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
            }}
          >
            토지거래허가 신청 도우미
          </h1>
          <div
            className="pill"
            style={{
              background: ready ? 'var(--ok-soft)' : 'var(--warm-soft)',
              color: ready ? 'oklch(35% 0.1 155)' : 'var(--warm-ink)',
            }}
          >
            <span className="pill-dot" /> {ready ? '응답 가능' : '응답 중'}
          </div>
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'var(--ink-3)',
            marginTop: 4,
          }}
          className="lp-header-sub"
        >
          강남구 거래허가 구역 · Gemini 기반 자연어 상담
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }} className="lp-header-actions">
        <button
          type="button"
          className="btn btn-ghost"
          style={{ padding: '8px 12px', fontSize: 13 }}
          aria-label="대화 검색"
        >
          <Icons.search size={14} /> 검색
        </button>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .lp-menu-btn {
            display: none;
          }
        }
        @media (max-width: 767.98px) {
          .lp-header-sub {
            display: none;
          }
          .lp-header-actions {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}

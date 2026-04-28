'use client';

import Link from 'next/link';
import { Icons } from './Icons';
import { Logo } from './Logo';

export interface LpSession {
  id: string;
  title: string;
  date: string;
  status: '진행중' | '완료';
  active?: boolean;
  isMock?: boolean;
}

interface LpSidebarProps {
  sessions: LpSession[];
  onNew: () => void;
  open: boolean;
  onClose: () => void;
}

const MOCK_SESSIONS: LpSession[] = [
  { id: 'm-1', title: '강남구 대치동 거래허가', date: '오늘', status: '진행중', active: true, isMock: true },
  { id: 'm-2', title: '서초동 도곡로 매수 검토', date: '어제', status: '완료', isMock: true },
  { id: 'm-3', title: '청담동 99-12 권리분석', date: '3일 전', status: '완료', isMock: true },
  { id: 'm-4', title: '잠원동 토지 분할 상담', date: '지난 주', status: '완료', isMock: true },
];

export function LpSidebar({ sessions, onNew, open, onClose }: LpSidebarProps) {
  const list = sessions.length > 0 ? sessions : MOCK_SESSIONS;

  return (
    <>
      {/* Mobile backdrop */}
      {open ? (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 40,
          }}
          className="md-hidden-when-desktop"
          aria-hidden
        />
      ) : null}

      <aside
        data-open={open}
        style={{
          width: 280,
          flexShrink: 0,
          background: 'var(--paper-2)',
          borderRight: '1px solid var(--line)',
          display: 'flex',
          flexDirection: 'column',
        }}
        className="lp-sidebar"
      >
        <div
          style={{
            padding: '18px 18px',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Logo />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="사이드바 닫기"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--ink-3)',
              padding: 4,
            }}
            className="lp-sidebar-close"
          >
            <Icons.close size={18} />
          </button>
        </div>

        <div style={{ padding: '14px 14px' }}>
          <button
            type="button"
            onClick={onNew}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <Icons.plus size={16} stroke={2} />
            <span>새 상담 시작</span>
          </button>
        </div>

        <div
          style={{
            padding: '4px 18px 8px',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--ink-3)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          최근 상담
        </div>

        <div className="scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 10px' }}>
          {list.map((s) => (
            <button
              key={s.id}
              type="button"
              disabled={s.isMock}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '10px 12px',
                borderRadius: 10,
                background: s.active ? 'white' : 'transparent',
                border: s.active ? '1px solid var(--line)' : '1px solid transparent',
                marginBottom: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                boxShadow: s.active ? 'var(--shadow-1)' : 'none',
                cursor: s.isMock ? 'not-allowed' : 'pointer',
                opacity: s.isMock && !s.active ? 0.85 : 1,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: s.active ? 600 : 500,
                  color: 'var(--ink)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {s.title}
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 11,
                  color: 'var(--ink-3)',
                }}
              >
                <span>{s.date}</span>
                <span
                  style={{
                    color: s.status === '진행중' ? 'var(--warm-ink)' : 'var(--ink-3)',
                    fontWeight: 500,
                  }}
                >
                  · {s.status}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div
          style={{
            padding: '14px 14px',
            borderTop: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
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
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>데모 사용자</div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>일반회원</div>
          </div>
        </div>
      </aside>

      <style jsx>{`
        .lp-sidebar {
          height: 100%;
        }
        .lp-sidebar-close {
          display: inline-flex;
        }
        @media (min-width: 768px) {
          .lp-sidebar {
            position: relative;
            transform: none !important;
          }
          .lp-sidebar-close {
            display: none;
          }
          .md-hidden-when-desktop {
            display: none !important;
          }
        }
        @media (max-width: 767.98px) {
          .lp-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 50;
            transform: translateX(-100%);
            transition: transform 0.2s ease;
          }
          .lp-sidebar[data-open='true'] {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}

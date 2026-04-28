import { Icons } from '../Icons';
import { RichCard } from '../RichCard';
import type { StepDef } from './types';

interface StepCardProps {
  title?: string;
  steps: StepDef[];
  current: number;
}

export function StepCard({ title = '신청 절차', steps, current }: StepCardProps) {
  return (
    <RichCard icon={<Icons.doc size={14} />} label={title} accent="warm">
      <div style={{ padding: '18px 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {steps.map((s, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 12,
                  position: 'relative',
                  paddingBottom: i === steps.length - 1 ? 0 : 14,
                }}
              >
                {i !== steps.length - 1 ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: 11,
                      top: 24,
                      bottom: 0,
                      width: 2,
                      background: done ? 'var(--ink)' : 'var(--line-2)',
                    }}
                  />
                ) : null}
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 999,
                    background: done ? 'var(--ink)' : active ? 'white' : 'var(--paper-2)',
                    color: done ? 'var(--paper)' : active ? 'var(--ink)' : 'var(--ink-4)',
                    border: active
                      ? '2px solid var(--ink)'
                      : done
                        ? 'none'
                        : '1.5px solid var(--line-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    flexShrink: 0,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {done ? <Icons.check size={12} stroke={2.5} /> : i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: done ? 'var(--ink-3)' : active ? 'var(--ink)' : 'var(--ink-3)',
                      textDecoration: done ? 'line-through' : 'none',
                    }}
                  >
                    {s.title}
                  </div>
                  {s.desc ? (
                    <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
                      {s.desc}
                    </div>
                  ) : null}
                </div>
                {active ? (
                  <div
                    className="pill"
                    style={{
                      background: 'var(--warm-soft)',
                      color: 'var(--warm-ink)',
                      alignSelf: 'flex-start',
                      flexShrink: 0,
                    }}
                  >
                    진행 중
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </RichCard>
  );
}

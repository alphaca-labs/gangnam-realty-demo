'use client';

import { Icons, type IconKey } from '../Icons';
import { RichCard } from '../RichCard';
import type { ChoiceDef } from './types';

interface ChoiceCardProps {
  question: string;
  choices: ChoiceDef[];
  onSelect?: (id: string) => void;
}

function renderIcon(key?: string) {
  if (!key) return null;
  const k = key as IconKey;
  const fn = Icons[k];
  if (!fn) return null;
  return fn({ size: 14 });
}

export function ChoiceCard({ question, choices, onSelect }: ChoiceCardProps) {
  return (
    <RichCard icon={<Icons.spark size={14} />} label={question} accent="brand">
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {choices.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect?.(c.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              borderRadius: 10,
              border: '1px solid var(--line)',
              background: 'var(--paper-2)',
              textAlign: 'left',
              transition: 'all .15s',
              width: '100%',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--ink-3)';
              e.currentTarget.style.background = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--line)';
              e.currentTarget.style.background = 'var(--paper-2)';
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: 'white',
                border: '1px solid var(--line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--ink-2)',
                flexShrink: 0,
              }}
            >
              {renderIcon(c.iconKey)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{c.label}</div>
              {c.desc ? (
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--ink-3)',
                    marginTop: 2,
                    lineHeight: 1.5,
                  }}
                >
                  {c.desc}
                </div>
              ) : null}
            </div>
            <Icons.arrowRight size={16} />
          </button>
        ))}
      </div>
    </RichCard>
  );
}

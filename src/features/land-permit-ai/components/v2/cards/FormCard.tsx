'use client';

import type { ReactNode } from 'react';
import { Icons } from '../Icons';
import { RichCard } from '../RichCard';
import type { FieldDescriptor } from './types';

interface FormCardProps {
  title: string;
  fields: FieldDescriptor[];
  submitLabel?: string;
  icon?: ReactNode;
  onAnswer?: (path: string) => void;
}

export function FormCard({
  title,
  fields,
  submitLabel = '대화로 답변하기',
  icon,
  onAnswer,
}: FormCardProps) {
  return (
    <RichCard icon={icon ?? <Icons.edit size={14} />} label={title}>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {fields.map((f, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onAnswer?.(f.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              padding: '10px 12px',
              border: '1px solid var(--line-2)',
              borderRadius: 10,
              background: 'var(--paper-2)',
              textAlign: 'left',
              transition: 'all .15s',
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--ink-2)',
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <span>
                {f.label} {f.required ? <span style={{ color: 'var(--warn)' }}>*</span> : null}
              </span>
              {f.hint ? (
                <span style={{ color: 'var(--ink-4)', fontWeight: 400 }}>{f.hint}</span>
              ) : null}
            </span>
            <span
              style={{
                fontSize: 13,
                color: 'var(--ink-3)',
                lineHeight: 1.5,
              }}
            >
              {f.placeholder ?? '대화로 알려주시면 자동 입력됩니다.'}
            </span>
            {f.help ? <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{f.help}</span> : null}
          </button>
        ))}
      </div>
      <div style={{ padding: '0 16px 16px', display: 'flex', gap: 8 }}>
        <button
          type="button"
          className="btn btn-soft"
          style={{ flex: 1, fontSize: 13 }}
          onClick={() => onAnswer?.(fields[0]?.path ?? '')}
        >
          {submitLabel}
        </button>
      </div>
    </RichCard>
  );
}

'use client';

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from 'react';
import { Icons } from '../Icons';
import { RichCard } from '../RichCard';
import type { FieldDescriptor } from './types';

interface FormCardProps {
  title: string;
  fields: FieldDescriptor[];
  submitLabel?: string;
  icon?: ReactNode;
  onSubmit?: (values: Record<string, string>) => void;
  onChatFallback?: () => void;
}

function formatRrnInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 13);
  if (digits.length <= 6) return digits;
  return `${digits.slice(0, 6)}-${digits.slice(6)}`;
}

function isFilled(field: FieldDescriptor, value: string | undefined): boolean {
  if (field.type === 'consent') return value === 'true';
  if (field.type === 'boolean') return value === 'true' || value === 'false';
  if (field.type === 'split-id') return /^\d{6}-\d{7}$/.test(value ?? '');
  return Boolean(value && value.trim().length > 0);
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--line-2)',
  borderRadius: 8,
  padding: '8px 10px',
  fontSize: 13,
  background: 'white',
  color: 'var(--ink)',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const toggleBaseStyle: React.CSSProperties = {
  flex: 1,
  padding: '8px 12px',
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all .15s',
};

export function FormCard({
  title,
  fields,
  submitLabel = '이대로 보내기',
  icon,
  onSubmit,
  onChatFallback,
}: FormCardProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [splitIdParts, setSplitIdParts] = useState<
    Record<string, { front: string; back: string }>
  >({});
  const splitIdBackRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const allRequiredFilled = useMemo(() => {
    return fields.every((f) => {
      if (!f.required) return true;
      return isFilled(f, values[f.path]);
    });
  }, [fields, values]);

  const setValue = useCallback((path: string, next: string) => {
    setValues((prev) => ({ ...prev, [path]: next }));
  }, []);

  function handleTextChange(field: FieldDescriptor, e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (field.type === 'id') {
      setValue(field.path, formatRrnInput(raw));
      return;
    }
    setValue(field.path, raw);
  }

  const handleSplitIdChange = useCallback(
    (path: string, segment: 'front' | 'back', raw: string) => {
      const digits = raw.replace(/\D/g, '').slice(0, segment === 'front' ? 6 : 7);
      setSplitIdParts((prev) => {
        const cur = prev[path] ?? { front: '', back: '' };
        const nextParts = { ...cur, [segment]: digits };
        const composed =
          nextParts.front.length === 6 && nextParts.back.length >= 1
            ? `${nextParts.front}-${nextParts.back}`
            : nextParts.front;
        setValue(path, composed);
        return { ...prev, [path]: nextParts };
      });
      if (segment === 'front' && digits.length === 6) {
        const ref = splitIdBackRefs.current[path];
        if (ref) ref.focus();
      }
    },
    [setValue],
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!allRequiredFilled) return;
    onSubmit?.(values);
  }

  return (
    <RichCard icon={icon ?? <Icons.edit size={14} />} label={title}>
      <form onSubmit={handleSubmit}>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {fields.map((f) => (
            <div key={f.path} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label
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
                  {f.label}{' '}
                  {f.required ? <span style={{ color: 'var(--warn)' }}>*</span> : null}
                </span>
                {f.hint ? (
                  <span style={{ color: 'var(--ink-4)', fontWeight: 400 }}>{f.hint}</span>
                ) : null}
              </label>

              {f.type === 'consent' ? (
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 10px',
                    border: '1px solid var(--line-2)',
                    borderRadius: 8,
                    background: 'var(--paper-2)',
                    cursor: 'pointer',
                    fontSize: 13,
                    color: 'var(--ink-2)',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={values[f.path] === 'true'}
                    onChange={(e) => setValue(f.path, e.target.checked ? 'true' : '')}
                    style={{ width: 16, height: 16, cursor: 'pointer' }}
                  />
                  <span>동의합니다</span>
                </label>
              ) : f.type === 'boolean' ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['true', 'false'] as const).map((opt) => {
                    const active = values[f.path] === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setValue(f.path, opt)}
                        style={{
                          ...toggleBaseStyle,
                          border: active
                            ? '1px solid var(--ink)'
                            : '1px solid var(--line-2)',
                          background: active ? 'var(--ink)' : 'var(--paper-2)',
                          color: active ? 'var(--paper)' : 'var(--ink-2)',
                        }}
                      >
                        {opt === 'true' ? '예' : '아니오'}
                      </button>
                    );
                  })}
                </div>
              ) : f.type === 'radio' && f.options && f.options.length > 0 ? (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {f.options.map((opt) => {
                    const active = values[f.path] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setValue(f.path, opt.value)}
                        style={{
                          ...toggleBaseStyle,
                          flex: '1 1 auto',
                          minWidth: 100,
                          border: active
                            ? '1px solid var(--ink)'
                            : '1px solid var(--line-2)',
                          background: active ? 'var(--ink)' : 'var(--paper-2)',
                          color: active ? 'var(--paper)' : 'var(--ink-2)',
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              ) : f.type === 'split-id' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={splitIdParts[f.path]?.front ?? ''}
                    onChange={(e) => handleSplitIdChange(f.path, 'front', e.target.value)}
                    placeholder="앞 6자리"
                    style={{ ...inputStyle, flex: 1 }}
                    autoComplete="off"
                  />
                  <span style={{ color: 'var(--ink-3)', fontSize: 13 }}>-</span>
                  <input
                    ref={(el) => {
                      splitIdBackRefs.current[f.path] = el;
                    }}
                    type="password"
                    inputMode="numeric"
                    maxLength={7}
                    value={splitIdParts[f.path]?.back ?? ''}
                    onChange={(e) => handleSplitIdChange(f.path, 'back', e.target.value)}
                    placeholder="뒷 7자리"
                    style={{ ...inputStyle, flex: 1 }}
                    autoComplete="off"
                  />
                </div>
              ) : f.type === 'select' && f.options && f.options.length > 0 ? (
                <select
                  value={values[f.path] ?? ''}
                  onChange={(e) => setValue(f.path, e.target.value)}
                  style={inputStyle}
                >
                  <option value="" disabled>
                    선택해주세요
                  </option>
                  {f.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type === 'tel' ? 'tel' : 'text'}
                  inputMode={
                    f.type === 'tel' || f.type === 'number' || f.type === 'id'
                      ? 'numeric'
                      : undefined
                  }
                  value={values[f.path] ?? ''}
                  onChange={(e) => handleTextChange(f, e)}
                  placeholder={f.placeholder}
                  style={inputStyle}
                  autoComplete="off"
                />
              )}

              {f.help ? (
                <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{f.help}</span>
              ) : null}
            </div>
          ))}
        </div>
        <div style={{ padding: '0 16px 16px', display: 'flex', gap: 8 }}>
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              flex: 1,
              fontSize: 13,
              opacity: allRequiredFilled ? 1 : 0.5,
              cursor: allRequiredFilled ? 'pointer' : 'not-allowed',
            }}
            disabled={!allRequiredFilled}
          >
            {submitLabel}
          </button>
          {onChatFallback ? (
            <button
              type="button"
              className="btn btn-soft"
              style={{ fontSize: 13 }}
              onClick={onChatFallback}
            >
              대화로 답하기
            </button>
          ) : null}
        </div>
      </form>
    </RichCard>
  );
}

'use client';

import {
  useCallback,
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
}

function formatRrnInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 13);
  if (digits.length <= 6) return digits;
  return `${digits.slice(0, 6)}-${digits.slice(6)}`;
}

function validateField(field: FieldDescriptor, value: string | undefined): string | null {
  const v = (value ?? '').trim();
  // required 누락
  if (field.required) {
    if (field.type === 'consent' && v !== 'true') return '동의가 필요한 항목입니다';
    if (field.type === 'boolean' && v !== 'true' && v !== 'false') return '선택해주세요';
    if (field.type === 'radio' && !v) return '선택해주세요';
    if (field.type === 'select' && !v) return '선택해주세요';
    if (!v) {
      if (field.type === 'split-id' || field.type === 'id') return '주민번호 13자리를 입력해주세요';
      if (field.type === 'tel') return '연락처를 입력해주세요';
      if (field.type === 'number') return '숫자를 입력해주세요';
      return `${field.label}을(를) 입력해주세요`;
    }
  }
  // 값이 있는 경우의 형식 검증
  if (v) {
    if (field.type === 'split-id' && !/^\d{6}-\d{7}$/.test(v))
      return '앞 6자리·뒷 7자리를 모두 입력해주세요';
    if (field.type === 'id' && !/^\d{6}-\d{7}$/.test(v))
      return '주민번호 형식이 올바르지 않습니다';
    if (field.type === 'tel' && !/^\d{2,3}-\d{3,4}-\d{4}$/.test(v))
      return '연락처 형식이 올바르지 않습니다 (예: 010-1234-5678)';
    if (field.type === 'number' && !/^[\d.,억만\s]+$/.test(v)) return '숫자만 입력해주세요';
  }
  return null;
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
}: FormCardProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [splitIdParts, setSplitIdParts] = useState<
    Record<string, { front: string; back: string }>
  >({});
  const splitIdBackRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const firstErrorRefs = useRef<Record<string, HTMLElement | null>>({});

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
    const next: Record<string, string> = {};
    for (const f of fields) {
      const msg = validateField(f, values[f.path]);
      if (msg) next[f.path] = msg;
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const firstPath = fields.find((f) => next[f.path])?.path;
      if (firstPath) {
        const el = firstErrorRefs.current[firstPath];
        if (el && 'focus' in el) {
          try {
            (el as HTMLInputElement).focus({ preventScroll: true });
          } catch {
            (el as HTMLInputElement).focus();
          }
        }
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    onSubmit?.(values);
  }

  return (
    <RichCard icon={icon ?? <Icons.edit size={14} />} label={title}>
      <form onSubmit={handleSubmit}>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {fields.map((f) => {
            const errorMsg = errors[f.path];
            const errorBorder = errorMsg ? '1px solid var(--warn)' : undefined;
            return (
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
                    ref={(el) => {
                      firstErrorRefs.current[f.path] = el;
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 10px',
                      border: errorBorder ?? '1px solid var(--line-2)',
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
                  <div
                    ref={(el) => {
                      firstErrorRefs.current[f.path] = el;
                    }}
                    style={{ display: 'flex', gap: 8 }}
                  >
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
                              : errorBorder ?? '1px solid var(--line-2)',
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
                  <div
                    ref={(el) => {
                      firstErrorRefs.current[f.path] = el;
                    }}
                    style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
                  >
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
                              : errorBorder ?? '1px solid var(--line-2)',
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
                      ref={(el) => {
                        firstErrorRefs.current[f.path] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={splitIdParts[f.path]?.front ?? ''}
                      onChange={(e) => handleSplitIdChange(f.path, 'front', e.target.value)}
                      placeholder="앞 6자리"
                      style={{
                        ...inputStyle,
                        flex: 1,
                        ...(errorBorder ? { border: errorBorder } : null),
                      }}
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
                      style={{
                        ...inputStyle,
                        flex: 1,
                        ...(errorBorder ? { border: errorBorder } : null),
                      }}
                      autoComplete="off"
                    />
                  </div>
                ) : f.type === 'select' && f.options && f.options.length > 0 ? (
                  <select
                    ref={(el) => {
                      firstErrorRefs.current[f.path] = el;
                    }}
                    value={values[f.path] ?? ''}
                    onChange={(e) => setValue(f.path, e.target.value)}
                    style={{
                      ...inputStyle,
                      ...(errorBorder ? { border: errorBorder } : null),
                    }}
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
                    ref={(el) => {
                      firstErrorRefs.current[f.path] = el;
                    }}
                    type={f.type === 'tel' ? 'tel' : 'text'}
                    inputMode={
                      f.type === 'tel' || f.type === 'number' || f.type === 'id'
                        ? 'numeric'
                        : undefined
                    }
                    value={values[f.path] ?? ''}
                    onChange={(e) => handleTextChange(f, e)}
                    placeholder={f.placeholder}
                    style={{
                      ...inputStyle,
                      ...(errorBorder ? { border: errorBorder } : null),
                    }}
                    autoComplete="off"
                  />
                )}

                {errorMsg ? (
                  <span style={{ fontSize: 11, color: 'var(--warn)', fontWeight: 500 }}>
                    {errorMsg}
                  </span>
                ) : f.help ? (
                  <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{f.help}</span>
                ) : null}
              </div>
            );
          })}
        </div>
        <div style={{ padding: '0 16px 16px', display: 'flex', gap: 8 }}>
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              flex: 1,
              fontSize: 13,
            }}
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </RichCard>
  );
}

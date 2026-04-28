'use client';

import { useRef, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react';
import { Icons } from './Icons';

interface ComposerProps {
  value: string;
  onChange: (next: string) => void;
  onSubmit: (text: string) => void;
  suggestions?: string[];
  disabled?: boolean;
  placeholder?: string;
}

export function Composer({
  value,
  onChange,
  onSubmit,
  suggestions = [],
  disabled,
  placeholder = '메시지를 입력하세요. 주소나 지번을 알려주시면 더 정확하게 안내해 드려요.',
}: ComposerProps) {
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (disabled) return;
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const trimmed = value.trim();
      if (!trimmed || disabled) return;
      onSubmit(trimmed);
    }
  }

  function autoresize(e: ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value);
    const el = e.currentTarget;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  }

  function handleSuggestion(text: string) {
    onChange(text);
    setTimeout(() => taRef.current?.focus(), 0);
  }

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div
      style={{
        padding: '14px 18px 18px',
        background: 'linear-gradient(180deg, transparent, var(--paper) 30%)',
        borderTop: '1px solid var(--line)',
      }}
      className="lp-composer-wrap"
    >
      {suggestions.length > 0 ? (
        <div
          style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}
          className="lp-composer-chips"
        >
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              className="chip"
              onClick={() => handleSuggestion(s)}
              disabled={disabled}
            >
              <Icons.spark size={12} />
              {s}
            </button>
          ))}
        </div>
      ) : null}

      <form onSubmit={handleSubmit}>
        <div
          style={{
            background: 'white',
            border: '1px solid var(--line-2)',
            borderRadius: 18,
            padding: '4px 4px 4px 14px',
            display: 'flex',
            alignItems: 'flex-end',
            gap: 6,
            boxShadow: 'var(--shadow-2)',
          }}
        >
          <button
            type="button"
            aria-label="첨부"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--ink-3)',
              padding: 8,
              marginBottom: 4,
              display: 'flex',
              alignItems: 'center',
            }}
            className="lp-composer-aux"
            disabled
          >
            <Icons.attach size={20} stroke={1.6} />
          </button>
          <textarea
            ref={taRef}
            value={value}
            onChange={autoresize}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            style={{
              flex: 1,
              minHeight: 24,
              maxHeight: 132,
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: 15,
              lineHeight: 1.55,
              padding: '12px 0',
              background: 'transparent',
              color: 'var(--ink)',
              fontFamily: 'inherit',
            }}
          />
          <button
            type="button"
            aria-label="음성 입력"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--ink-3)',
              padding: 8,
              marginBottom: 4,
              display: 'flex',
              alignItems: 'center',
            }}
            className="lp-composer-aux"
            disabled
          >
            <Icons.mic size={20} stroke={1.6} />
          </button>
          <button
            type="submit"
            aria-label="전송"
            disabled={!canSend}
            style={{
              background: canSend ? 'var(--ink)' : 'var(--paper-3)',
              color: canSend ? 'var(--paper)' : 'var(--ink-4)',
              border: 'none',
              borderRadius: 12,
              width: 40,
              height: 40,
              marginBottom: 4,
              marginRight: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all .15s',
              cursor: canSend ? 'pointer' : 'default',
            }}
          >
            <Icons.send size={18} stroke={2} />
          </button>
        </div>
      </form>

      <div
        style={{
          marginTop: 10,
          textAlign: 'center',
          fontSize: 11,
          color: 'var(--ink-4)',
        }}
        className="lp-composer-foot"
      >
        AI 응답은 참고용입니다. 법적 효력이 있는 신청은 강남구청을 통해 진행해 주세요.
      </div>

      <style jsx>{`
        @media (max-width: 767.98px) {
          .lp-composer-wrap {
            padding: 10px 12px 14px;
          }
          .lp-composer-aux {
            display: none !important;
          }
          .lp-composer-chips {
            gap: 6px !important;
          }
          .lp-composer-foot {
            font-size: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}

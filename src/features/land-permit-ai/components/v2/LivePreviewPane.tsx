'use client';

import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import type { CaseType } from '@/data/land-permit';
import { buildDocuments, type PreviewDocument } from '../../engine/documents';
import { maskRrnInString } from '../../state/store';
import type { Answers } from '../../types/answers';

interface LivePreviewPaneProps {
  caseType: CaseType | null;
  answers: Answers;
}

// A4 = 210mm x 297mm. With ~40% panel width on a typical 1280px desktop,
// inner content area ≈ 480px. 210mm ≈ 794px @ 96dpi → scale 0.55 fits with margin.
const A4_SCALE = 0.55;
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

export function LivePreviewPane({ caseType, answers }: LivePreviewPaneProps) {
  const deferredAnswers = useDeferredValue(answers);
  const [activeIdx, setActiveIdx] = useState(0);

  const docs = useMemo<PreviewDocument[]>(() => {
    if (!caseType) return [];
    try {
      return buildDocuments(caseType, deferredAnswers);
    } catch {
      return [];
    }
  }, [caseType, deferredAnswers]);

  // active idx clamp when caseType change shrinks doc count
  useEffect(() => {
    if (activeIdx >= docs.length && docs.length > 0) setActiveIdx(0);
  }, [docs.length, activeIdx]);

  const activeDoc = docs[activeIdx];
  const lastHtmlRef = useRef<string>('');
  const [srcDoc, setSrcDoc] = useState('');

  useEffect(() => {
    if (!activeDoc) {
      if (lastHtmlRef.current !== '') {
        lastHtmlRef.current = '';
        setSrcDoc('');
      }
      return;
    }
    const masked = maskRrnInString(activeDoc.html);
    if (masked !== lastHtmlRef.current) {
      lastHtmlRef.current = masked;
      setSrcDoc(masked);
    }
  }, [activeDoc]);

  if (!caseType) {
    return (
      <aside
        className="lp-preview-pane"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: 'var(--paper-2)',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <div
          style={{
            fontSize: 13,
            color: 'var(--ink-3)',
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          케이스를 선택하면
          <br />
          서식이 여기 표시됩니다.
        </div>
      </aside>
    );
  }

  return (
    <aside
      className="lp-preview-pane"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--paper-2)',
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 14px',
          borderBottom: '1px solid var(--line-2)',
          background: 'var(--paper)',
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--ink-2)',
            letterSpacing: '-0.01em',
          }}
        >
          서식 미리보기
        </div>
        <div
          style={{
            fontSize: 11,
            color: 'var(--ink-3)',
          }}
        >
          (실시간 갱신)
        </div>
      </div>

      {docs.length > 1 ? (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            padding: '8px 12px',
            borderBottom: '1px solid var(--line-2)',
            background: 'var(--paper)',
          }}
        >
          {docs.map((d, i) => {
            const active = i === activeIdx;
            return (
              <button
                key={d.filename}
                type="button"
                onClick={() => setActiveIdx(i)}
                style={{
                  fontSize: 11,
                  padding: '5px 9px',
                  borderRadius: 6,
                  border:
                    '1px solid ' + (active ? 'var(--ink)' : 'var(--line-2)'),
                  background: active ? 'var(--ink)' : 'var(--paper-2)',
                  color: active ? 'var(--paper)' : 'var(--ink-2)',
                  cursor: 'pointer',
                  letterSpacing: '-0.01em',
                  whiteSpace: 'nowrap',
                }}
                title={d.filename}
              >
                {d.filename.replace(/^\d+[-_]?\d*_/, '')}
              </button>
            );
          })}
        </div>
      ) : null}

      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: 16,
          minHeight: 0,
        }}
      >
        <div
          style={{
            width: `${A4_WIDTH_MM}mm`,
            height: `${A4_HEIGHT_MM}mm`,
            transform: `scale(${A4_SCALE})`,
            transformOrigin: 'top left',
            // Reserve scaled visual footprint so scrollbar fits
            marginBottom: `${-(1 - A4_SCALE) * 297}mm`,
            marginRight: `${-(1 - A4_SCALE) * 210}mm`,
          }}
        >
          <iframe
            title="서식 미리보기"
            srcDoc={srcDoc}
            // sandbox="" → 완전 격리. HTML이 인라인 <style>만 사용하고
            // Pretendard도 시스템 폰트 fallback 안전 → 외부 fetch 불필요.
            sandbox=""
            style={{
              width: `${A4_WIDTH_MM}mm`,
              height: `${A4_HEIGHT_MM}mm`,
              border: '1px solid var(--line-2)',
              background: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              display: 'block',
            }}
          />
        </div>
      </div>
    </aside>
  );
}

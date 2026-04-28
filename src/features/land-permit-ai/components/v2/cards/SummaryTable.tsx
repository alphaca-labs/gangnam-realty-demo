'use client';

import { Icons } from '../Icons';
import { RichCard } from '../RichCard';

interface SummaryTableProps {
  title: string;
  rows: Array<[string, string]>;
  onOpenReview?: () => void;
  showActions?: boolean;
}

export function SummaryTable({ title, rows, onOpenReview, showActions }: SummaryTableProps) {
  return (
    <RichCard
      icon={<Icons.clip size={14} />}
      label={title}
      accent="ok"
      footer={
        showActions ? (
          <>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ padding: '8px 12px', fontSize: 13 }}
              onClick={onOpenReview}
            >
              <Icons.search size={14} /> 검토 결과 열기
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{ padding: '8px 12px', fontSize: 13 }}
              onClick={onOpenReview}
            >
              <Icons.download size={14} /> PDF 받기
            </button>
          </>
        ) : null
      }
    >
      <div style={{ padding: 4 }}>
        {rows.map((r, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr',
              gap: 12,
              padding: '11px 14px',
              borderBottom: i === rows.length - 1 ? 'none' : '1px dashed var(--line)',
              alignItems: 'baseline',
            }}
          >
            <div style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 500 }}>{r[0]}</div>
            <div
              style={{
                fontSize: 13.5,
                color: 'var(--ink)',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                wordBreak: 'break-word',
              }}
              className="tnum"
            >
              {r[1]}
            </div>
          </div>
        ))}
      </div>
    </RichCard>
  );
}

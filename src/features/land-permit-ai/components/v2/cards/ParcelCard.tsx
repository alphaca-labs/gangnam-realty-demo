import { Icons } from '../Icons';
import { RichCard } from '../RichCard';
import type { AutoLookupFilledField, AutoLookupSource } from './types';

interface ParcelCardProps {
  address: string;
  jibun?: string;
  area?: string;
  use?: string;
  owner?: string;
  value?: string;
  filled?: AutoLookupFilledField[];
  source?: AutoLookupSource;
}

const FIELD_LABEL: Record<AutoLookupFilledField, string> = {
  landCategory: '지목',
  landArea: '면적',
  landZone: '용도지역',
};

export function ParcelCard({
  address,
  jibun,
  area,
  use,
  owner,
  value,
  filled = [],
  source = 'mock',
}: ParcelCardProps) {
  const sourceLabel =
    source === 'vworld'
      ? 'VWorld'
      : source === 'mock'
        ? '데모 데이터'
        : source === 'failed'
          ? '조회 실패'
          : '미적용';

  const rows: Array<[string, string | undefined]> = [
    ['면적', area],
    ['지목 / 용도', use],
    ['소유자', owner],
    ['공시지가', value],
  ];

  return (
    <RichCard icon={<Icons.pin size={14} />} label="조회된 토지 정보" accent="brand">
      <div>
        <div
          style={{
            position: 'relative',
            height: 140,
            borderBottom: '1px solid var(--line)',
          }}
          className="map-tiles"
        >
          <svg
            viewBox="0 0 320 140"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          >
            <path
              d="M40 30 L 120 20 L 180 50 L 200 100 L 120 120 L 50 110 Z"
              fill="oklch(82% 0.06 145 / 0.4)"
              stroke="oklch(55% 0.1 150)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <path
              d="M180 50 L 260 40 L 290 90 L 200 100 Z"
              fill="rgb(20 65 150 / 0.16)"
              stroke="rgb(20, 65, 150)"
              strokeWidth="1.5"
            />
            <circle cx="240" cy="70" r="6" fill="rgb(20, 65, 150)" />
            <circle cx="240" cy="70" r="14" fill="rgb(20 65 150 / 0.2)" />
          </svg>
          <div
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: 'white',
              border: '1px solid var(--line)',
              borderRadius: 8,
              padding: '4px 10px',
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: 'var(--ink-2)',
              fontWeight: 500,
            }}
          >
            {sourceLabel}
          </div>
        </div>
        <div style={{ padding: 16 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--ink)',
              letterSpacing: '-0.02em',
              wordBreak: 'keep-all',
            }}
          >
            {address}
          </div>
          {jibun ? (
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--ink-3)',
                marginTop: 4,
              }}
            >
              지번 · {jibun}
            </div>
          ) : null}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '14px 16px',
              marginTop: 14,
              paddingTop: 14,
              borderTop: '1px dashed var(--line)',
            }}
          >
            {rows.map(([k, v]) => (
              <div key={k}>
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--ink-3)',
                    fontWeight: 500,
                    marginBottom: 3,
                  }}
                >
                  {k}
                </div>
                <div
                  style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}
                  className="tnum"
                >
                  {v ?? '-'}
                </div>
              </div>
            ))}
          </div>

          {filled.length > 0 ? (
            <div
              style={{
                marginTop: 12,
                paddingTop: 10,
                borderTop: '1px dashed var(--line)',
                fontSize: 11,
                color: 'var(--brand-ink)',
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <Icons.spark size={12} />
              <span>자동 채움:</span>
              {filled.map((f) => (
                <span
                  key={f}
                  className="pill"
                  style={{ background: 'var(--brand-soft)', color: 'var(--brand-ink)' }}
                >
                  {FIELD_LABEL[f]}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </RichCard>
  );
}

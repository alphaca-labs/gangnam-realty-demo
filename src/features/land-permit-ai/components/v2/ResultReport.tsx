'use client';

import { useMemo, useState } from 'react';
import type { CaseType } from '@/data/land-permit';
import { caseDefinitions } from '@/data/land-permit';
import { generatePermitZip } from '@/lib/zip-generator';
import type { Answers } from '../../types/answers';
import { buildDocuments } from '../../engine/documents';
import { mapAnswersToForms } from '../../engine/answer-mapper';
import { formatKrw, parseAmount } from '../../utils/currency';
import { maskRrnInString } from '../../state/store';
import { Icons } from './Icons';

interface ResultReportProps {
  caseType: CaseType;
  answers: Answers;
  isComplete: boolean;
  missingCount: number;
  sharedNotice?: boolean;
  onClose: () => void;
  onShareQr: () => void;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function buildConsultationId(caseType: CaseType): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const seed = (caseType.length * 911 + now.getDate() * 37 + now.getHours()) % 9999;
  const id = String(seed).padStart(4, '0');
  return `GN-${yyyy}-${mm}-${id}`;
}

function formatToday(): string {
  const d = new Date();
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 작성`;
}

export function ResultReport({
  caseType,
  answers,
  isComplete,
  missingCount,
  sharedNotice = false,
  onClose,
  onShareQr,
}: ResultReportProps) {
  const [busy, setBusy] = useState<'pdf' | 'first' | null>(null);

  const docs = useMemo(() => buildDocuments(caseType, answers), [caseType, answers]);
  const forms = useMemo(() => mapAnswersToForms(caseType, answers), [caseType, answers]);
  const def = caseDefinitions.find((c) => c.type === caseType)!;

  const grandTotal =
    parseAmount(forms.funding.depositAmount) +
    parseAmount(forms.funding.stockAmount) +
    parseAmount(forms.funding.giftAmount) +
    parseAmount(forms.funding.cashAmount) +
    parseAmount(forms.funding.propertyDisposalAmount) +
    parseAmount(forms.funding.compensationAmount) +
    parseAmount(forms.funding.mortgageLoan) +
    parseAmount(forms.funding.creditLoan) +
    parseAmount(forms.funding.otherLoan) +
    parseAmount(forms.funding.otherBorrowing);

  const contractAmount = parseAmount(forms.application.contractAmount);
  const ownEquity =
    parseAmount(forms.funding.depositAmount) +
    parseAmount(forms.funding.cashAmount) +
    parseAmount(forms.funding.stockAmount);
  const loanAmount =
    parseAmount(forms.funding.mortgageLoan) +
    parseAmount(forms.funding.creditLoan) +
    parseAmount(forms.funding.otherLoan);

  const equityRatio = grandTotal > 0 ? Math.round((ownEquity / grandTotal) * 1000) / 10 : 0;
  const loanRatio = grandTotal > 0 ? Math.round((loanAmount / grandTotal) * 1000) / 10 : 0;

  const consultationId = useMemo(() => buildConsultationId(caseType), [caseType]);

  const heroRows: Array<[string, string]> = [
    ['신청 케이스', def.label],
    ['거래 권리', forms.application.rightType || '-'],
    [
      '계약예정금액',
      contractAmount > 0 ? formatKrw(contractAmount) : '-',
    ],
    [
      '자기자금',
      ownEquity > 0 ? `${formatKrw(ownEquity)}${equityRatio ? ` (${equityRatio}%)` : ''}` : '-',
    ],
    [
      '대출자금',
      loanAmount > 0 ? `${formatKrw(loanAmount)}${loanRatio ? ` (${loanRatio}%)` : ''}` : '-',
    ],
    ['조달자금 합계', grandTotal > 0 ? formatKrw(grandTotal) : '-'],
  ];

  const checklistItems: Array<[string, boolean]> = [
    ['토지거래허가 신청서', true],
    ['토지이용계획서', isComplete],
    ['자금조달계획서', grandTotal > 0],
    ['개인정보 수집·이용 동의서', true],
    ['매도인·매수인 인적사항', Boolean(forms.application.sellerName && forms.application.buyerName)],
    ['금융기관 대출 확약서', false],
  ];

  const risks = [
    {
      t: '실거주 의무',
      d: '허가일로부터 24개월 이내 입주·이용 계획을 이행해야 합니다. 미이행 시 이행강제금이 부과될 수 있습니다.',
    },
    {
      t: '대출 비중',
      d: loanRatio > 40
        ? `거래가 대비 ${loanRatio}%로, 시중은행 LTV 한도(40%)보다 높습니다. 추가 자기자금 또는 보증이 필요할 수 있습니다.`
        : '대출 비중은 적정 범위 내로 보입니다. 금융기관 확약서 첨부를 권장합니다.',
    },
    {
      t: '처리 기간',
      d: '평균 12일, 보완 요청 시 최대 30일 소요될 수 있습니다.',
    },
  ];

  const buyerAddress = maskRrnInString(forms.application.buyerAddress || '');
  const sellerAddress = maskRrnInString(forms.application.sellerAddress || '');

  async function handleAllPdf() {
    setBusy('pdf');
    try {
      const blob = await generatePermitZip(docs);
      const now = new Date();
      const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
      downloadBlob(blob, `토지거래허가_서류_${dateStr}.zip`);
    } finally {
      setBusy(null);
    }
  }

  async function handleFirstPdf() {
    if (docs.length === 0) return;
    setBusy('first');
    try {
      const blob = await generatePermitZip([docs[0]]);
      downloadBlob(blob, `${docs[0].filename}.zip`);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div
      className="scroll paper"
      style={{
        width: '100%',
        flex: 1,
        overflowY: 'auto',
      }}
    >
      <div
        style={{ padding: '32px 36px 56px', maxWidth: 1080, margin: '0 auto' }}
        className="lp-result-inner"
      >
        {sharedNotice ? (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              background: 'var(--paper-2)',
              border: '1px solid var(--line-2)',
              fontSize: 13,
              color: 'var(--ink-2)',
              marginBottom: 16,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>
              다른 분이 공유한 신청서를 검토 중입니다.
              {missingCount > 0
                ? ` 미입력 ${missingCount}건이 있어 일부 항목이 비어 있을 수 있습니다.`
                : ''}
            </span>
            {missingCount > 0 ? (
              <button
                type="button"
                className="btn btn-ghost"
                style={{ padding: '4px 10px', fontSize: 12 }}
                onClick={onClose}
              >
                채팅으로 이어서 작성
              </button>
            ) : null}
          </div>
        ) : null}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 24,
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 10px',
                borderRadius: 999,
                background: isComplete ? 'var(--ok-soft)' : 'var(--warm-soft)',
                color: isComplete ? 'oklch(35% 0.1 155)' : 'var(--warm-ink)',
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              <Icons.check size={12} stroke={2.5} />
              {isComplete ? '검토 완료' : `미입력 ${missingCount}건 — 임시 검토`}
            </div>
            <h1
              style={{
                margin: 0,
                fontFamily: 'var(--font-serif)',
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: 'var(--ink)',
                lineHeight: 1.2,
              }}
            >
              토지거래허가 신청서 — 검토 결과
            </h1>
            <div style={{ marginTop: 6, fontSize: 13, color: 'var(--ink-3)' }}>
              상담번호{' '}
              <span className="tnum" style={{ fontFamily: 'var(--font-mono)' }}>
                {consultationId}
              </span>{' '}
              · {formatToday()}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              <Icons.arrowRight size={14} stroke={2} /> 대화로 돌아가기
            </button>
            <button type="button" className="btn btn-ghost" onClick={onShareQr}>
              <Icons.qr size={14} /> QR 공유
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => void handleAllPdf()}
              disabled={busy !== null || docs.length === 0}
            >
              {busy === 'pdf' ? <Icons.refresh size={14} /> : <Icons.download size={14} />}
              {busy === 'pdf' ? 'PDF 생성 중...' : 'PDF 다운로드'}
            </button>
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: 24,
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr',
            gap: 28,
            marginBottom: 20,
            background: 'white',
          }}
        >
          <div className="lp-result-hero-left">
            <div
              style={{
                fontSize: 11,
                color: 'var(--ink-3)',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              대상 토지
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                wordBreak: 'keep-all',
              }}
            >
              {[forms.application.landAddress, forms.application.landLotNumber]
                .filter(Boolean)
                .join(' ') || '미입력'}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--ink-3)',
                marginTop: 4,
              }}
            >
              {forms.application.landArea ? `${forms.application.landArea}㎡` : '면적 미입력'}
              {forms.application.landCategory ? ` · ${forms.application.landCategory}` : ''}
              {forms.application.landZone ? ` · ${forms.application.landZone}` : ''}
            </div>

            <div
              style={{
                marginTop: 20,
                padding: '16px 18px',
                background: 'var(--brand-soft)',
                borderRadius: 12,
                color: 'var(--brand-ink)',
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
              }}
            >
              <Icons.spark size={18} />
              <div style={{ fontSize: 13.5, lineHeight: 1.6 }}>
                <strong>AI 검토 의견.</strong>{' '}
                {isComplete
                  ? '입력하신 신청 내용은 토지거래허가 기준에 부합할 가능성이 높습니다. 자금조달계획의 자기자금/대출 비중과 실거주 의무 24개월 조건을 확인하세요.'
                  : `현재 ${missingCount}개 항목이 비어 있습니다. 누락된 정보를 채우시면 검토 정확도가 크게 향상됩니다.`}{' '}
                강남구청 평균 처리 기간은 12일입니다.
              </div>
            </div>

            <div
              style={{
                marginTop: 18,
                paddingTop: 14,
                borderTop: '1px dashed var(--line)',
                display: 'grid',
                gridTemplateColumns: '110px 1fr',
                rowGap: 8,
                columnGap: 14,
                fontSize: 13,
              }}
            >
              <span style={{ color: 'var(--ink-3)' }}>매수인</span>
              <span style={{ fontWeight: 500 }}>
                {forms.application.buyerName || '-'}
                {buyerAddress ? <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}> · {buyerAddress}</span> : null}
              </span>
              <span style={{ color: 'var(--ink-3)' }}>매도인</span>
              <span style={{ fontWeight: 500 }}>
                {forms.application.sellerName || '-'}
                {sellerAddress ? <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}> · {sellerAddress}</span> : null}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {heroRows.map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  borderBottom: '1px dashed var(--line)',
                  paddingBottom: 10,
                  gap: 12,
                }}
              >
                <span style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 500 }}>{k}</span>
                <span
                  className="tnum"
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    textAlign: 'right',
                    wordBreak: 'break-word',
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            marginBottom: 20,
          }}
          className="lp-result-grid"
        >
          <div className="card" style={{ padding: 18, background: 'white' }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '-0.01em',
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Icons.check size={14} /> 제출 서류 현황
            </div>
            {checklistItems.map(([t, done]) => (
              <div
                key={t}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 0',
                  borderBottom: '1px dashed var(--line)',
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 5,
                    background: done ? 'var(--ink)' : 'transparent',
                    border: done ? 'none' : '1.5px solid var(--line-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--paper)',
                    flexShrink: 0,
                  }}
                >
                  {done ? <Icons.check size={11} stroke={3} /> : null}
                </div>
                <span
                  style={{
                    fontSize: 13,
                    color: done ? 'var(--ink-3)' : 'var(--ink)',
                    textDecoration: done ? 'line-through' : 'none',
                  }}
                >
                  {t}
                </span>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 18, background: 'white' }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '-0.01em',
                marginBottom: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Icons.shield size={14} /> 유의 사항
            </div>
            {risks.map((r) => (
              <div key={r.t} style={{ padding: '10px 0', borderBottom: '1px dashed var(--line)' }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{r.t}</div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--ink-3)',
                    lineHeight: 1.55,
                    marginTop: 3,
                  }}
                >
                  {r.d}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 20, background: 'white' }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>다음 단계</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => void handleAllPdf()}
              disabled={busy !== null || docs.length === 0}
            >
              <Icons.download size={14} /> 서류 ZIP 다운로드
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => void handleFirstPdf()}
              disabled={busy !== null || docs.length === 0}
            >
              <Icons.doc size={14} /> 허가신청서만 받기
            </button>
            <button type="button" className="btn btn-ghost" onClick={onShareQr}>
              <Icons.qr size={14} /> QR로 공유
            </button>
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              대화로 돌아가기
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 767.98px) {
          .lp-result-inner {
            padding: 20px 14px 40px !important;
          }
          .lp-result-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 900px) {
          .card[data-grid='hero'] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

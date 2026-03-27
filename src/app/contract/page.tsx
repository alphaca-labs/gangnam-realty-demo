'use client';

import { useState } from 'react';
import { FileText, ExternalLink } from 'lucide-react';

export default function ContractPage() {
  const [type, setType] = useState<'매매' | '전세' | '월세'>('매매');

  const procedures = {
    매매: [
      { step: 1, title: '계약금 지급', desc: '계약서 작성 및 계약금(보통 10%) 지급', duration: '당일' },
      { step: 2, title: '중도금 지급', desc: '중도금 지급 (선택사항)', duration: '계약 후 1~2개월' },
      { step: 3, title: '잔금 준비', desc: '대출 승인 및 잔금 준비', duration: '잔금일 2주 전' },
      { step: 4, title: '등기 이전', desc: '소유권 이전등기 및 잔금 지급', duration: '잔금일' },
      { step: 5, title: '거래신고', desc: '부동산거래신고(30일 이내)', duration: '계약 후 30일 이내' },
    ],
    전세: [
      { step: 1, title: '계약금 지급', desc: '계약서 작성 및 계약금(보통 10%) 지급', duration: '당일' },
      { step: 2, title: '전입신고 예약', desc: '동사무소 전입신고 예약', duration: '잔금 전' },
      { step: 3, title: '잔금 지급', desc: '전입신고 + 확정일자 당일 잔금 지급', duration: '계약일' },
      { step: 4, title: '확정일자', desc: '임대차계약서 확정일자 날인', duration: '전입신고 당일' },
      { step: 5, title: '보증보험', desc: '전세금반환보증보험 가입 (선택)', duration: '계약 후' },
    ],
    월세: [
      { step: 1, title: '계약금 지급', desc: '계약서 작성 및 계약금 지급', duration: '당일' },
      { step: 2, title: '전입신고', desc: '동사무소 전입신고', duration: '입주일' },
      { step: 3, title: '확정일자', desc: '임대차계약서 확정일자 날인', duration: '전입신고 당일' },
      { step: 4, title: '월세 자동이체', desc: '월세 자동이체 등록', duration: '입주 후' },
      { step: 5, title: '입주', desc: '열쇠 수령 및 입주', duration: '계약일' },
    ],
  };

  const documents = {
    매매: ['신분증', '인감증명서', '등기권리증', '계약서', '매매대금영수증'],
    전세: ['신분증', '등본(집주인)', '계약서', '잔금영수증', '전입신고서'],
    월세: ['신분증', '계약서', '보증금영수증', '전입신고서'],
  };

  const specialTerms = [
    '집주인의 동의 없이 전대차(재임대) 불가',
    '계약 해지 시 3개월 전 통보',
    '집주인의 채무로 인한 경매 시 보증금 우선 변제',
    '시설물 수리는 ○○원 이하 임차인 부담',
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">전자계약 가이드</h1>
            <p className="text-sm text-text-secondary">계약 유형별 절차 안내</p>
          </div>
        </div>

        {/* 탭 */}
        <div className="flex gap-3 mb-6">
          {(['매매', '전세', '월세'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex-1 px-6 py-3 rounded-lg transition-colors font-medium ${
                type === t ? 'bg-primary text-white' : 'bg-white border border-border'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* 계약 절차 */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl border border-border">
            <h2 className="font-semibold text-lg mb-6">{type} 계약 절차</h2>
            <div className="space-y-4">
              {procedures[type].map((proc, idx) => (
                <div key={idx} className="relative pl-12">
                  {idx < procedures[type].length - 1 && (
                    <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-border"></div>
                  )}
                  <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold z-10">
                    {proc.step}
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold">{proc.title}</h3>
                      <span className="text-xs text-text-secondary bg-sidebar px-2 py-1 rounded">
                        {proc.duration}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">{proc.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 특약 예시 */}
            <div className="mt-8">
              <h3 className="font-semibold mb-3">특약사항 예시</h3>
              <div className="space-y-2">
                {specialTerms.map((term, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-3 bg-sidebar rounded-lg text-sm">
                    <span className="text-accent font-bold">•</span>
                    <span>{term}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 필요 서류 & 샘플 */}
          <div className="space-y-6">
            {/* 필요 서류 */}
            <div className="bg-white p-6 rounded-xl border border-border">
              <h2 className="font-semibold text-lg mb-4">필요 서류</h2>
              <div className="space-y-2">
                {documents[type].map((doc, idx) => (
                  <label key={idx} className="flex items-center gap-3 p-2 bg-sidebar rounded-lg">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm">{doc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 샘플 계약서 */}
            <div className="bg-white p-6 rounded-xl border border-border">
              <h2 className="font-semibold text-lg mb-4">샘플 계약서</h2>
              <div className="p-4 bg-sidebar rounded-lg border border-border mb-4">
                <div className="text-center mb-4">
                  <div className="text-xl font-bold mb-2">{type} 계약서</div>
                  <div className="text-xs text-text-secondary">표준계약서 양식</div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-border pb-1">
                    <span>소재지</span>
                    <span>서울시 강남구...</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-1">
                    <span>계약금</span>
                    <span>금 ○○원정</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-1">
                    <span>계약일</span>
                    <span>2026년 ○월 ○일</span>
                  </div>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm">
                샘플 다운로드
              </button>
            </div>

            {/* 외부 링크 */}
            <div className="bg-accent/5 p-4 rounded-xl border border-accent/20">
              <h3 className="font-semibold text-sm mb-3 text-accent">관련 사이트</h3>
              <a
                href="https://kras.go.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 bg-white rounded-lg hover:bg-sidebar transition-colors text-xs"
              >
                <span>부동산거래전자계약</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

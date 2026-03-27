'use client';

import { useState } from 'react';
import { FileQuestion, ChevronDown, ChevronUp } from 'lucide-react';

interface Guide {
  title: string;
  icon: string;
  steps: Array<{ title: string; desc: string }>;
  tips: string[];
}

const guides: Guide[] = [
  {
    title: '부동산 거래신고',
    icon: '📝',
    steps: [
      { title: '계약 체결', desc: '매매계약서 작성 (매도인·매수인·중개인 서명)' },
      { title: '신고서 작성', desc: '부동산거래신고서 작성 (국토부 누리집 또는 중개사무소)' },
      { title: '신고 제출', desc: '계약일로부터 30일 이내 관할 시·군·구청 제출' },
      { title: '검토 및 확인', desc: '담당 공무원 검토 (1~2일 소요)' },
      { title: '신고필증 발급', desc: '신고필증 수령 (잔금 지급 시 필요)' },
    ],
    tips: [
      '미신고 시 500만원 이하 과태료',
      '허위신고 시 3년 이하 징역 또는 3천만원 이하 벌금',
      '온라인 신고 가능 (부동산거래관리시스템)',
    ],
  },
  {
    title: '토지거래허가',
    icon: '🏞️',
    steps: [
      { title: '허가구역 확인', desc: '토지거래허가구역 지정 여부 확인' },
      { title: '허가신청', desc: '토지거래계약허가신청서 제출 (계약 전)' },
      { title: '심사', desc: '허가기준 적합 여부 심사 (15일 이내)' },
      { title: '허가 발급', desc: '허가증 수령 후 계약 체결 가능' },
      { title: '계약 체결', desc: '허가일로부터 2년 이내 계약 체결' },
    ],
    tips: [
      '허가 없이 계약 시 무효',
      '허가구역은 국토부 토지이음 사이트에서 확인',
      '투기 목적 토지 취득 방지를 위한 제도',
    ],
  },
  {
    title: '중개업 개설등록',
    icon: '🏢',
    steps: [
      { title: '자격 확인', desc: '공인중개사 자격증 보유 필수' },
      { title: '교육 이수', desc: '개업 전 실무교육 이수 (32시간)' },
      { title: '등록 신청', desc: '개설등록신청서 + 서류 제출 (시·군·구청)' },
      { title: '현장 조사', desc: '사무소 설치 요건 확인 (7일 이내)' },
      { title: '등록증 발급', desc: '중개사무소 개설등록증 수령' },
    ],
    tips: [
      '사무소는 독립된 공간이어야 함',
      '공인중개사 자격증은 5년마다 갱신',
      '개설등록 후 손해배상책임 보장설정 필수',
    ],
  },
  {
    title: '전세사기 예방 체크리스트',
    icon: '⚠️',
    steps: [
      { title: '등기부등본 확인', desc: '근저당, 가압류, 압류 등 권리관계 확인' },
      { title: '집주인 신분 확인', desc: '신분증 + 인감증명서로 실소유주 확인' },
      { title: '전입신고 + 확정일자', desc: '잔금일 당일 전입신고 + 확정일자 날인' },
      { title: '보증보험 가입', desc: '전세금반환보증보험 또는 HUG 보증 가입' },
      { title: '임대차 연체 확인', desc: '관리비 3개월 이상 연체 시 주의' },
      { title: '건물 실소유주 확인', desc: '대리인 계약 시 위임장 확인' },
      { title: '계약서 특약', desc: '특약사항 꼼꼼히 확인 (이중계약 방지)' },
      { title: '보증금 지급 방식', desc: '계좌이체로 거래 내역 남기기' },
    ],
    tips: [
      '선순위 보증금 + 대출 < 집값 80% 이하가 안전',
      '신축 빌라는 준공 후 등기부등본 확인',
      '의심스러우면 계약 보류하고 전문가 상담',
    ],
  },
];

export default function CivilPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileQuestion className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">민원 절차 가이드</h1>
            <p className="text-sm text-text-secondary">부동산 관련 주요 민원 안내</p>
          </div>
        </div>

        {/* 카테고리 카드 */}
        <div className="space-y-4">
          {guides.map((guide, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => toggleExpand(idx)}
                className="w-full flex items-center justify-between p-6 hover:bg-sidebar transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{guide.icon}</div>
                  <div className="text-left">
                    <h2 className="text-lg font-semibold">{guide.title}</h2>
                    <p className="text-sm text-text-secondary">{guide.steps.length}단계</p>
                  </div>
                </div>
                {expandedIndex === idx ? (
                  <ChevronUp className="w-5 h-5 text-text-secondary" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-text-secondary" />
                )}
              </button>

              {expandedIndex === idx && (
                <div className="p-6 pt-0 border-t border-border">
                  {/* 절차 */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-4">절차</h3>
                    <div className="space-y-3">
                      {guide.steps.map((step, stepIdx) => (
                        <div key={stepIdx} className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                            {stepIdx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm mb-1">{step.title}</div>
                            <div className="text-sm text-text-secondary">{step.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 주의사항 */}
                  <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
                    <h3 className="font-semibold text-sm mb-3 text-accent">💡 주의사항</h3>
                    <ul className="space-y-2">
                      {guide.tips.map((tip, tipIdx) => (
                        <li key={tipIdx} className="flex items-start gap-2 text-sm">
                          <span className="text-accent font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 문의 안내 */}
        <div className="mt-8 bg-primary-light p-6 rounded-xl border border-primary/20">
          <h3 className="font-semibold mb-2">문의처</h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">강남구청 부동산정보과:</span>
              <span className="text-primary">02-3423-5678</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">국토교통부 콜센터:</span>
              <span className="text-primary">1599-0001</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

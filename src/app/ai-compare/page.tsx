'use client';

import { useState } from 'react';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface Scenario {
  question: string;
  oldResponse: string;
  newResponse: {
    text: string;
    richContent?: {
      type: 'chart' | 'table' | 'calculator';
      data?: any;
    };
  };
}

const scenarios: Scenario[] = [
  {
    question: '압구정동 실거래가 알려주세요',
    oldResponse: '압구정동의 평균 실거래가는 약 24억 5천만원입니다. 자세한 정보는 국토교통부 실거래가 공개시스템을 참고하세요.',
    newResponse: {
      text: '압구정동의 최근 6개월 실거래가 추이를 차트와 표로 보여드립니다.',
      richContent: {
        type: 'chart',
        data: {
          chartData: [
            { month: '9월', price: 220000 },
            { month: '10월', price: 225000 },
            { month: '11월', price: 230000 },
            { month: '12월', price: 235000 },
            { month: '1월', price: 240000 },
            { month: '2월', price: 245000 },
          ],
          transactions: [
            { complex: '압구정 현대', price: 250000, floor: 15 },
            { complex: '압구정 한양', price: 240000, floor: 8 },
            { complex: '압구정 SK뷰', price: 245000, floor: 20 },
          ],
        },
      },
    },
  },
  {
    question: '5억원 매매 중개수수료 얼마인가요?',
    oldResponse: '5억원 매매 시 중개수수료는 최대 200만원(0.4%)입니다.',
    newResponse: {
      text: '5억원 매매 시 중개수수료를 자동으로 계산해드립니다.',
      richContent: {
        type: 'calculator',
        data: {
          amount: 500000000,
          rate: 0.4,
          commission: 2000000,
          vat: 200000,
          total: 2200000,
        },
      },
    },
  },
  {
    question: '전세사기 예방 방법',
    oldResponse: '전세사기를 예방하려면 등기부등본을 확인하고, 전입신고와 확정일자를 받으며, 보증보험에 가입하세요.',
    newResponse: {
      text: '전세사기 예방을 위한 8단계 체크리스트를 제공합니다.',
      richContent: {
        type: 'table',
        data: {
          items: [
            '① 등기부등본 필수 확인 (근저당, 가압류 등)',
            '② 집주인 신분 확인 (신분증, 인감증명서)',
            '③ 전입신고 + 확정일자 당일 받기',
            '④ 보증보험 가입 검토',
            '⑤ 임대차 3개월분 이상 연체 확인',
            '⑥ 건물 실소유주 확인',
            '⑦ 계약서 특약사항 꼼꼼히 확인',
            '⑧ 전세금반환보증보험 가입',
          ],
        },
      },
    },
  },
];

export default function AIComparePage() {
  const [currentScenario, setCurrentScenario] = useState(0);

  const handlePrev = () => {
    setCurrentScenario((prev) => (prev === 0 ? scenarios.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentScenario((prev) => (prev === scenarios.length - 1 ? 0 : prev + 1));
  };

  const scenario = scenarios[currentScenario];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">AI 상담 고도화 비교</h1>
            <p className="text-sm text-text-secondary">기존 챗봇 vs 웹 AI 상담</p>
          </div>
        </div>

        {/* 질문 */}
        <div className="bg-white p-6 rounded-xl border border-border mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">시나리오 {currentScenario + 1}/{scenarios.length}</h2>
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-lg border border-border hover:bg-sidebar transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-lg border border-border hover:bg-sidebar transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-user-msg rounded-xl">
            <div className="w-8 h-8 rounded-full bg-text-secondary text-white flex items-center justify-center text-sm font-bold">
              👤
            </div>
            <div className="text-lg">{scenario.question}</div>
          </div>
        </div>

        {/* 비교 */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* 기존 챗봇 */}
          <div className="bg-white p-6 rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-4">
              <div className="px-3 py-1 bg-text-secondary text-white text-xs font-semibold rounded-full">
                기존 챗봇
              </div>
              <span className="text-sm text-text-secondary">카카오톡 기반</span>
            </div>
            <div className="p-4 bg-sidebar rounded-xl">
              <p className="text-sm text-text-primary whitespace-pre-line">{scenario.oldResponse}</p>
            </div>
            <div className="mt-4 text-xs text-text-secondary space-y-1">
              <div>❌ 단순 텍스트 응답</div>
              <div>❌ 시각화 없음</div>
              <div>❌ 추가 검색 필요</div>
            </div>
          </div>

          {/* 웹 AI 상담 */}
          <div className="bg-white p-6 rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-4">
              <div className="px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full">
                웹 AI 상담 고도화
              </div>
              <span className="text-sm text-text-secondary">리치 응답</span>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-sidebar rounded-xl">
                <p className="text-sm text-text-primary whitespace-pre-line">{scenario.newResponse.text}</p>
              </div>

              {/* 리치 컨텐츠 */}
              {scenario.newResponse.richContent?.type === 'chart' && (
                <div className="p-4 bg-primary-light rounded-xl">
                  <div className="h-48 mb-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={scenario.newResponse.richContent.data.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => `${value / 10000}억원`} />
                        <Line type="monotone" dataKey="price" stroke="#1B4D8E" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    {scenario.newResponse.richContent.data.transactions.map((tx: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-xs bg-white p-2 rounded">
                        <span>{tx.complex}</span>
                        <span className="font-semibold">{formatCurrency(tx.price * 10000)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {scenario.newResponse.richContent?.type === 'calculator' && (
                <div className="p-4 bg-primary-light rounded-xl space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>매매가</span>
                    <span className="font-semibold">{formatCurrency(scenario.newResponse.richContent.data.amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>적용 요율</span>
                    <span className="font-semibold">{scenario.newResponse.richContent.data.rate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>중개수수료</span>
                    <span className="font-semibold">{formatCurrency(scenario.newResponse.richContent.data.commission)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>부가세</span>
                    <span className="font-semibold">{formatCurrency(scenario.newResponse.richContent.data.vat)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-primary/20">
                    <span className="font-bold">총 비용</span>
                    <span className="font-bold text-primary">{formatCurrency(scenario.newResponse.richContent.data.total)}</span>
                  </div>
                </div>
              )}

              {scenario.newResponse.richContent?.type === 'table' && (
                <div className="p-4 bg-primary-light rounded-xl space-y-2">
                  {scenario.newResponse.richContent.data.items.map((item: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 p-2 bg-white rounded text-sm">
                      <span className="text-accent">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 text-xs text-text-secondary space-y-1">
              <div>✅ 차트/표로 시각화</div>
              <div>✅ 실시간 계산</div>
              <div>✅ 한눈에 파악 가능</div>
            </div>
          </div>
        </div>

        {/* 차이점 요약 */}
        <div className="mt-8 bg-accent/5 p-6 rounded-xl border border-accent/20">
          <h3 className="font-semibold mb-4 text-accent">💡 웹 AI 상담의 강점</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <div className="font-semibold mb-2">📊 시각화</div>
              <p className="text-sm text-text-secondary">
                차트, 그래프로 데이터를 직관적으로 표현
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <div className="font-semibold mb-2">🧮 인터랙티브</div>
              <p className="text-sm text-text-secondary">
                실시간 계산기, 필터링, 정렬 기능
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <div className="font-semibold mb-2">📄 서류 미리보기</div>
              <p className="text-sm text-text-secondary">
                계약서, 확인서 양식을 바로 확인
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

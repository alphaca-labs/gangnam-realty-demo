'use client';

import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react';
import { ArrowUp, Building2, CheckSquare, Square } from 'lucide-react';
import {
  scenarios,
  defaultResponse,
  suggestionCards,
  fraudChecklist as initialChecklist,
  transactionSteps,
  type ChatMessage,
} from '@/data/chat-scenarios';
import { getMonthlyAvgByDong } from '@/data/mock-transactions';
import {
  calculateCommission,
  formatKoreanWon,
  type TransactionType,
} from '@/lib/calculator';

// ---------------------------------------------------------------------------
// Recharts -- rendered only on client to avoid SSR hydration issues
// ---------------------------------------------------------------------------
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

function PriceChart() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const data = getMonthlyAvgByDong('압구정동');

  if (!mounted) {
    return (
      <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
        차트 로딩 중...
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: '#6B7280' }}
          tickLine={false}
          axisLine={{ stroke: '#E5E7EB' }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#6B7280' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `${Math.round(v / 10000)}억`}
          width={45}
        />
        <Tooltip
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={((value: any) => [formatKoreanWon(Number(value) * 10000), '평균가']) as any}
          labelFormatter={(label) => `${label}`}
          contentStyle={{
            borderRadius: '0.75rem',
            border: '1px solid #E5E7EB',
            fontSize: 13,
          }}
        />
        <Line
          type="monotone"
          dataKey="avgPrice"
          stroke="#1B4D8E"
          strokeWidth={2.5}
          dot={{ r: 4, fill: '#1B4D8E', strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#1B4D8E' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ---------------------------------------------------------------------------
// Inline calculator card
// ---------------------------------------------------------------------------
function CalculatorCard() {
  const [txType, setTxType] = useState<TransactionType>('sale');
  const [amount, setAmount] = useState<number>(0);
  const [monthlyRent, setMonthlyRent] = useState<number>(0);

  const result = amount > 0 ? calculateCommission(txType, amount, monthlyRent) : null;

  const quickAmounts = [
    { label: '1억', value: 100000000 },
    { label: '3억', value: 300000000 },
    { label: '5억', value: 500000000 },
    { label: '10억', value: 1000000000 },
  ];

  return (
    <div className="space-y-4">
      {/* Transaction type selector */}
      <div className="flex gap-2">
        {([
          { key: 'sale' as const, label: '매매' },
          { key: 'lease' as const, label: '전세' },
          { key: 'monthly' as const, label: '월세' },
        ]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { setTxType(key); setAmount(0); setMonthlyRent(0); }}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              txType === key
                ? 'bg-[#1B4D8E] text-white'
                : 'bg-[#F7F7F8] text-[#6B7280] hover:bg-[#ECECF1]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Amount input */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#1A1A2E]">
          {txType === 'monthly' ? '보증금' : txType === 'lease' ? '전세금' : '매매가'}
        </label>
        <input
          type="number"
          value={amount || ''}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="금액을 입력하세요 (원)"
          className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#1B4D8E] focus:ring-1 focus:ring-[#1B4D8E]"
        />
      </div>

      {/* Monthly rent input for 월세 */}
      {txType === 'monthly' && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#1A1A2E]">월세</label>
          <input
            type="number"
            value={monthlyRent || ''}
            onChange={(e) => setMonthlyRent(Number(e.target.value))}
            placeholder="월세 금액 (원)"
            className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#1B4D8E] focus:ring-1 focus:ring-[#1B4D8E]"
          />
        </div>
      )}

      {/* Quick amount buttons */}
      <div className="flex flex-wrap gap-2">
        {quickAmounts.map((q) => (
          <button
            key={q.value}
            onClick={() => setAmount(q.value)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              amount === q.value
                ? 'bg-[#E3F2FD] text-[#1B4D8E]'
                : 'bg-[#F7F7F8] text-[#6B7280] hover:bg-[#ECECF1]'
            }`}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Result */}
      {result && (
        <div className="rounded-xl bg-[#F7F7F8] p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#6B7280]">적용 요율</span>
            <span className="font-medium text-[#1A1A2E]">{result.rate}% ({result.bracket})</span>
          </div>
          {result.convertedAmount && (
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">환산보증금</span>
              <span className="font-medium text-[#1A1A2E]">{formatKoreanWon(result.convertedAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-[#6B7280]">중개수수료</span>
            <span className="font-medium text-[#1A1A2E]">{formatKoreanWon(result.commission)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#6B7280]">부가세 (10%)</span>
            <span className="font-medium text-[#1A1A2E]">{formatKoreanWon(result.vat)}</span>
          </div>
          <div className="border-t border-[#E5E7EB] pt-2 flex justify-between">
            <span className="text-sm font-semibold text-[#1A1A2E]">총 비용</span>
            <span className="text-base font-bold text-[#10A37F]">{formatKoreanWon(result.total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Types for internal messages
// ---------------------------------------------------------------------------
interface InternalMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  richType?: ChatMessage['richType'];
  isTyping?: boolean;
}

// ---------------------------------------------------------------------------
// Main Chat Page
// ---------------------------------------------------------------------------
export default function ChatPage() {
  const [messages, setMessages] = useState<InternalMessage[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checklistState, setChecklistState] = useState(
    initialChecklist.map((item) => ({ ...item }))
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isProcessing) return;

      setInput('');

      // Add user message
      const userMsg: InternalMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
      };

      // Find matching scenario
      const lowerText = trimmed.toLowerCase();
      const matched = scenarios.find((s) =>
        s.keywords.some((kw) => lowerText.includes(kw))
      );
      const assistantData = matched ? matched.messages[0] : defaultResponse;

      // Add typing indicator first
      const typingMsg: InternalMessage = {
        id: `typing-${Date.now()}`,
        role: 'assistant',
        content: '',
        isTyping: true,
      };

      setMessages((prev) => [...prev, userMsg, typingMsg]);
      setIsProcessing(true);

      // Simulate AI response delay
      setTimeout(() => {
        const aiMsg: InternalMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: assistantData.content,
          richType: assistantData.richType,
        };
        setMessages((prev) =>
          prev.filter((m) => !m.isTyping).concat(aiMsg)
        );
        setIsProcessing(false);
      }, 1200);
    },
    [isProcessing]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const handleSuggestionClick = (title: string) => {
    handleSend(title);
  };

  const toggleChecklistItem = (id: number) => {
    setChecklistState((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // -----------------------------------------------------------------------
  // Render rich response cards
  // -----------------------------------------------------------------------
  function renderRichCard(msg: InternalMessage) {
    switch (msg.richType) {
      case 'chart':
        return (
          <div className="mt-3 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#E3F2FD]">
                <Building2 className="h-3.5 w-3.5 text-[#1B4D8E]" />
              </div>
              <h4 className="text-sm font-semibold text-[#1A1A2E]">
                압구정동 월별 평균 실거래가
              </h4>
            </div>
            <PriceChart />
            <p className="mt-2 text-xs text-[#6B7280]">
              * 만원 단위 평균가 기준 (2024.10~2025.03)
            </p>
          </div>
        );

      case 'calculator':
        return (
          <div className="mt-3 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#D1FAE5]">
                <span className="text-xs">🧮</span>
              </div>
              <h4 className="text-sm font-semibold text-[#1A1A2E]">
                중개수수료 계산기
              </h4>
            </div>
            <CalculatorCard />
          </div>
        );

      case 'checklist':
        return (
          <div className="mt-3 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#FEF3C7]">
                <span className="text-xs">🛡️</span>
              </div>
              <h4 className="text-sm font-semibold text-[#1A1A2E]">
                전세사기 예방 체크리스트
              </h4>
            </div>
            <div className="space-y-2">
              {checklistState.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className="flex w-full items-start gap-2.5 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-[#F7F7F8]"
                >
                  {item.checked ? (
                    <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-[#10A37F]" />
                  ) : (
                    <Square className="mt-0.5 h-4 w-4 shrink-0 text-[#D1D5DB]" />
                  )}
                  <span
                    className={`text-sm ${
                      item.checked
                        ? 'text-[#6B7280] line-through'
                        : 'text-[#1A1A2E]'
                    }`}
                  >
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-[#6B7280]">
              모든 항목을 확인한 후 계약을 진행하세요.
            </p>
          </div>
        );

      case 'steps':
        return (
          <div className="mt-3 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#E3F2FD]">
                <span className="text-xs">📋</span>
              </div>
              <h4 className="text-sm font-semibold text-[#1A1A2E]">
                부동산 거래신고 절차
              </h4>
            </div>
            <div className="relative ml-3 space-y-4 border-l-2 border-[#E5E7EB] pl-6">
              {transactionSteps.map((step, idx) => (
                <div key={step.step} className="relative">
                  <div className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-[#1B4D8E] text-xs font-bold text-white">
                    {step.step}
                  </div>
                  <h5 className="text-sm font-semibold text-[#1A1A2E]">
                    {step.title}
                  </h5>
                  <p className="mt-0.5 text-sm text-[#6B7280]">{step.desc}</p>
                  {idx < transactionSteps.length - 1 && (
                    <div className="h-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'default':
        return (
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestionCards.map((card) => (
              <button
                key={card.title}
                onClick={() => handleSuggestionClick(card.title)}
                className="rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-sm text-[#1A1A2E] shadow-sm transition-all hover:border-[#1B4D8E] hover:shadow-md"
              >
                {card.icon} {card.title}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  }

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-full flex-col pt-14 lg:pt-0">
      {/* Message area / Initial state */}
      <div className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          /* ---- Initial state: centered welcome ---- */
          <div className="flex h-full flex-col items-center justify-center px-4">
            <div className="flex flex-col items-center gap-4 pb-8">
              {/* Logo */}
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1B4D8E] text-2xl font-bold text-white shadow-lg">
                강
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-[#1A1A2E]">
                  강남부동산톡
                </h1>
                <p className="mt-1.5 text-[#6B7280]">
                  강남 부동산, 무엇이든 물어보세요
                </p>
              </div>
            </div>

            {/* Suggestion cards -- 2x2 grid */}
            <div className="grid w-full max-w-lg grid-cols-2 gap-3 px-2">
              {suggestionCards.map((card) => (
                <button
                  key={card.title}
                  onClick={() => handleSuggestionClick(card.title)}
                  className="group flex flex-col gap-1.5 rounded-2xl border border-[#E5E7EB] bg-white p-4 text-left shadow-sm transition-all hover:border-[#1B4D8E] hover:shadow-md"
                >
                  <span className="text-xl">{card.icon}</span>
                  <span className="text-sm font-semibold text-[#1A1A2E] group-hover:text-[#1B4D8E]">
                    {card.title}
                  </span>
                  <span className="text-xs text-[#6B7280]">
                    {card.subtitle}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ---- Messages list ---- */
          <div className="mx-auto w-full max-w-3xl px-4 py-6 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.isTyping ? (
                  /* Typing indicator */
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1B4D8E] text-xs font-bold text-white">
                      강
                    </div>
                    <div className="flex items-center gap-1 rounded-2xl bg-white px-4 py-3">
                      <span className="loading-dot h-2 w-2 rounded-full bg-[#6B7280]" />
                      <span className="loading-dot h-2 w-2 rounded-full bg-[#6B7280]" />
                      <span className="loading-dot h-2 w-2 rounded-full bg-[#6B7280]" />
                    </div>
                  </div>
                ) : msg.role === 'user' ? (
                  /* User message -- right aligned */
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl bg-[#F7F7F8] px-4 py-3 text-[15px] text-[#1A1A2E]">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  /* AI message -- left aligned */
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1B4D8E] text-xs font-bold text-white">
                      강
                    </div>
                    <div className="max-w-[85%] min-w-0">
                      <div className="text-[15px] leading-relaxed text-[#1A1A2E]">
                        {msg.content}
                      </div>
                      {msg.richType && renderRichCard(msg)}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input bar -- always at bottom */}
      <div className="shrink-0 border-t border-[#E5E7EB] bg-white px-4 py-3">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-3xl items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-2 shadow-sm transition-colors focus-within:border-[#1B4D8E] focus-within:shadow-md"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            disabled={isProcessing}
            className="flex-1 bg-transparent text-[15px] text-[#1A1A2E] placeholder:text-[#9CA3AF] outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#10A37F] text-white transition-opacity hover:opacity-90 disabled:opacity-30"
            aria-label="전송"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </form>
        <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-[#9CA3AF]">
          강남부동산톡은 데모 버전입니다. 실제 법률/거래 상담은 전문가에게 문의하세요.
        </p>
      </div>
    </div>
  );
}

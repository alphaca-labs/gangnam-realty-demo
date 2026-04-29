'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import type { ChatMessage } from '../../types/message';
import type { CaseType } from '@/data/land-permit';
import { caseDefinitions } from '@/data/land-permit';
import type { Answers } from '../../types/answers';
import type { RichSlot } from './cards/types';
import { AIBubble } from './AIBubble';
import { AIText } from './AIText';
import { UserBubble } from './UserBubble';
import { Typing } from './Typing';
import { FormCard } from './cards/FormCard';
import { ParcelCard } from './cards/ParcelCard';
import { StepCard } from './cards/StepCard';
import { SummaryTable } from './cards/SummaryTable';
import { ChoiceCard } from './cards/ChoiceCard';

interface ChatTimelineProps {
  messages: ChatMessage[];
  caseType: CaseType | null;
  answers: Answers;
  isTyping?: boolean;
  onSelectCase?: (caseType: CaseType) => void;
  onAnswerField?: (path: string) => void;
  onSubmitFormFields?: (values: Record<string, string>) => void;
  onOpenReview?: () => void;
  trailingSlot?: ReactNode;
}

function formatTime(ts: number): string {
  if (!ts) return '';
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes();
  const period = h < 12 ? '오전' : '오후';
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${period} ${hh}:${String(m).padStart(2, '0')}`;
}

const CASE_CHOICES = caseDefinitions.map((c) => ({
  id: c.type,
  label: c.label,
  desc: c.description,
  iconKey:
    c.type === 'self-occupy'
      ? 'pin'
      : c.type === 'non-residential'
        ? 'card'
        : c.type === 'tax-deferral'
          ? 'doc'
          : 'user',
}));

export function ChatTimeline({
  messages,
  caseType,
  answers,
  isTyping,
  onSelectCase,
  onAnswerField,
  onSubmitFormFields,
  onOpenReview,
  trailingSlot,
}: ChatTimelineProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const hasMessages = messages.length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, isTyping, trailingSlot]);

  function renderSlot(slot: RichSlot, key: string) {
    switch (slot.kind) {
      case 'text':
        return null;
      case 'parcel':
        return (
          <ParcelCard
            key={key}
            address={slot.address}
            jibun={slot.jibun}
            area={slot.area}
            use={slot.use}
            owner={slot.owner}
            value={slot.value}
            filled={slot.filled}
            source={slot.source}
          />
        );
      case 'form':
        return (
          <FormCard
            key={key}
            title={slot.title}
            fields={slot.fields}
            submitLabel={slot.submitLabel}
            onSubmit={onSubmitFormFields}
            onChatFallback={
              onAnswerField
                ? () => onAnswerField(slot.fields[0]?.path ?? '')
                : undefined
            }
          />
        );
      case 'summary':
        return (
          <SummaryTable
            key={key}
            title={slot.title}
            rows={slot.rows}
            onOpenReview={onOpenReview}
            showActions={slot.allowDownload}
          />
        );
      case 'step':
        return <StepCard key={key} title={slot.title} steps={slot.steps} current={slot.current} />;
      case 'choice':
        return null;
      default:
        return null;
    }
  }

  return (
    <div
      className="scroll paper"
      style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      <div
        style={{
          padding: '24px 20px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
        className="lp-timeline-inner"
      >
        {!hasMessages && !caseType ? (
          <>
            <AIBubble time="">
              <AIText>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 16,
                    marginBottom: 6,
                    letterSpacing: '-0.02em',
                  }}
                >
                  안녕하세요 👋
                </div>
                토지거래허가 신청을 도와드릴게요. 강남구 일대 거래허가 구역의 매매·증여·교환 신청서를{' '}
                <span className="mark">단계별로 함께 작성</span>해 드립니다.
                <div style={{ marginTop: 10, fontSize: 13, color: 'var(--ink-3)' }}>
                  먼저 어떤 케이스로 신청하실지 알려주세요.
                </div>
              </AIText>
            </AIBubble>
            <AIBubble time="">
              <ChoiceCard
                question="어떤 케이스로 신청하시나요?"
                choices={CASE_CHOICES}
                onSelect={(id) => onSelectCase?.(id as CaseType)}
              />
            </AIBubble>
          </>
        ) : null}

        {messages.map((m) => {
          if (m.role === 'user') {
            return (
              <UserBubble key={m.id} time={formatTime(m.timestamp)}>
                {m.content}
              </UserBubble>
            );
          }
          const slots = m.slots && m.slots.length > 0 ? m.slots : ([{ kind: 'text' }] as RichSlot[]);
          return (
            <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <AIBubble time={formatTime(m.timestamp)}>
                <AIText>{m.content}</AIText>
              </AIBubble>
              {slots
                .filter((s) => s.kind !== 'text')
                .map((s, i) => (
                  <AIBubble key={`${m.id}-slot-${i}`} time="">
                    {renderSlot(s, `${m.id}-${i}`)}
                  </AIBubble>
                ))}
            </div>
          );
        })}

        {isTyping ? <Typing /> : null}
        {trailingSlot}
        <div ref={bottomRef} />
      </div>

      <style jsx>{`
        @media (max-width: 767.98px) {
          .lp-timeline-inner {
            padding: 16px 12px 8px !important;
            gap: 14px !important;
          }
        }
      `}</style>
    </div>
  );
}

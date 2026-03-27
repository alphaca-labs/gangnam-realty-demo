'use client';

import { useState, useCallback } from 'react';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Lightbulb,
  Info,
  FileText,
} from 'lucide-react';
import { civilGuides, type CivilGuide } from '@/data/civil-guides';
import { cn } from '@/lib/utils';

export default function CivilPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCard = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const toggleCheck = useCallback((key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const fraudGuide = civilGuides.find((g) => g.id === 'fraud-prevention');
  const fraudCheckedCount = fraudGuide
    ? fraudGuide.steps.filter((_, i) => checkedItems[`fraud-${i}`]).length
    : 0;
  const fraudTotal = fraudGuide ? fraudGuide.steps.length : 0;

  return (
    <div className="flex-1 overflow-y-auto pt-14 lg:pt-0">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light">
            <FileText className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            민원 절차 가이드
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            부동산 관련 민원 절차를 한눈에 확인하세요
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
          {civilGuides.map((guide) => {
            const isExpanded = expandedId === guide.id;
            const isFraud = guide.id === 'fraud-prevention';

            return (
              <div key={guide.id} className="flex flex-col">
                {/* Card */}
                <button
                  onClick={() => toggleCard(guide.id)}
                  className={cn(
                    'flex w-full items-start gap-4 rounded-2xl border bg-white p-5 text-left shadow-sm transition-all hover:shadow-md',
                    isExpanded
                      ? 'border-l-4 border-l-primary border-t-border border-r-border border-b-border'
                      : 'border-border'
                  )}
                >
                  <span className="mt-0.5 text-2xl leading-none" role="img">
                    {guide.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-semibold text-foreground">
                        {guide.title}
                      </h2>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {guide.description}
                    </p>
                    {!isExpanded && (
                      <p className="mt-2 text-xs text-muted-foreground/70">
                        {isFraud
                          ? `${guide.steps.length}개 체크항목`
                          : `${guide.steps.length}단계 절차`}
                      </p>
                    )}
                  </div>
                </button>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="mt-0 rounded-b-2xl border border-t-0 border-border bg-white px-5 pb-5 pt-3 shadow-sm">
                    {isFraud ? (
                      <FraudChecklist
                        guide={guide}
                        checkedItems={checkedItems}
                        checkedCount={fraudCheckedCount}
                        total={fraudTotal}
                        onToggle={toggleCheck}
                      />
                    ) : (
                      <StepperView guide={guide} />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info Note */}
        <div className="mt-8 mb-8 flex items-start gap-2.5 rounded-xl bg-muted/50 px-4 py-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
            * 위 절차는 일반적인 안내이며, 세부 사항은 관할 구청이나
            공인중개사에게 확인하시기 바랍니다.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Stepper View ─── */

function StepperView({ guide }: { guide: CivilGuide }) {
  return (
    <div className="relative ml-1 pl-6">
      {/* Vertical connecting line */}
      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />

      <ol className="space-y-5">
        {guide.steps.map((step, idx) => (
          <li key={idx} className="relative">
            {/* Step circle */}
            <div className="absolute -left-6 top-0 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white">
              {idx + 1}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
              {step.tip && (
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                  <Lightbulb className="h-3 w-3" />
                  {step.tip}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ─── Fraud Checklist ─── */

function FraudChecklist({
  guide,
  checkedItems,
  checkedCount,
  total,
  onToggle,
}: {
  guide: CivilGuide;
  checkedItems: Record<string, boolean>;
  checkedCount: number;
  total: number;
  onToggle: (key: string) => void;
}) {
  const percent = total > 0 ? Math.round((checkedCount / total) * 100) : 0;

  return (
    <div>
      {/* Progress */}
      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <span>체크 진행률</span>
          <span className="font-medium text-foreground">
            {checkedCount}/{total} ({percent}%)
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Checklist Items */}
      <ul className="space-y-3">
        {guide.steps.map((step, idx) => {
          const key = `fraud-${idx}`;
          const isChecked = !!checkedItems[key];

          return (
            <li key={idx}>
              <label className="flex cursor-pointer items-start gap-3 group">
                <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggle(key)}
                    className="peer sr-only"
                  />
                  <span
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors',
                      isChecked
                        ? 'border-accent bg-accent'
                        : 'border-border bg-white group-hover:border-accent/50'
                    )}
                  >
                    {isChecked && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                    )}
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <span
                    className={cn(
                      'text-sm font-medium transition-colors',
                      isChecked
                        ? 'text-muted-foreground line-through'
                        : 'text-foreground'
                    )}
                  >
                    {step.title}
                  </span>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                  {step.tip && (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                      <Lightbulb className="h-3 w-3" />
                      {step.tip}
                    </span>
                  )}
                </div>
              </label>
            </li>
          );
        })}
      </ul>

      {/* All done message */}
      {checkedCount === total && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-accent/10 px-4 py-3 text-sm font-medium text-accent">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          모든 항목을 확인했습니다. 안전한 거래 되세요!
        </div>
      )}
    </div>
  );
}

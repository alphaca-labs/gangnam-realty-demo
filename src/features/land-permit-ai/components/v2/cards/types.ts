import type { ReactNode } from 'react';
import type { CaseType } from '@/data/land-permit';
import type { Answers } from '../../../types/answers';

export type AutoLookupSource = 'vworld' | 'mock' | 'skipped' | 'failed';
export type AutoLookupFilledField = 'landCategory' | 'landArea' | 'landZone';

export interface AutoLookupMeta {
  applied: boolean;
  source: AutoLookupSource;
  filled: AutoLookupFilledField[];
  note?: string;
}

export interface FieldDescriptor {
  path: string;
  label: string;
  placeholder?: string;
  hint?: string;
  help?: string;
  required?: boolean;
  type?: 'text' | 'number' | 'tel' | 'boolean' | 'consent' | 'id';
  value?: string;
}

export interface ChoiceDef {
  id: string;
  iconKey?: string;
  label: string;
  desc?: string;
}

export interface StepDef {
  title: string;
  desc?: string;
}

export type RichSlot =
  | { kind: 'text' }
  | {
      kind: 'parcel';
      address: string;
      jibun?: string;
      area?: string;
      use?: string;
      owner?: string;
      value?: string;
      filled: AutoLookupFilledField[];
      source: AutoLookupSource;
    }
  | { kind: 'form'; title: string; submitLabel?: string; fields: FieldDescriptor[] }
  | { kind: 'summary'; title: string; rows: Array<[string, string]>; allowDownload?: boolean }
  | { kind: 'step'; title: string; current: number; steps: StepDef[] }
  | { kind: 'choice'; question: string; choices: ChoiceDef[] };

export interface AssistantTurnContext {
  text: string;
  autoLookup?: AutoLookupMeta | null;
  missingFields: string[];
  askFields?: string[];
  isComplete: boolean;
  caseType: CaseType | null;
  answers: Answers;
  totalRequiredCount: number;
  prevProgress: number;
}

export interface MessageMeta {
  autoLookup?: AutoLookupMeta | null;
  confidence?: Record<string, 'high' | 'medium' | 'low'>;
  progress?: number;
}

export type ReactSlot = ReactNode;

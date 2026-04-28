import type { CaseType } from '@/data/land-permit';

export type Answers = Record<string, unknown>;

export interface ChatSnapshot {
  caseType: CaseType | null;
  answers: Answers;
  schemaVersion: number;
}

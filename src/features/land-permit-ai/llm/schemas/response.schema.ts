import { z } from 'zod';
import type { CaseType } from '@/data/land-permit';
import { zApplicationPartial } from './application.schema';
import { zLandUseSelfPartial } from './land-use-self.schema';
import { zLandUseOtherPartial } from './land-use-other.schema';
import { zLandUseTaxPartial } from './land-use-tax.schema';
import { zFundingPartial } from './funding.schema';
import { zPrivacyPartial } from './privacy.schema';
import { zProxyPartial } from './proxy.schema';

const zConfidence = z.enum(['high', 'medium', 'low']);

const zExtractedFull = z
  .object({
    application: zApplicationPartial,
    landUseSelf: zLandUseSelfPartial,
    landUseOther: zLandUseOtherPartial,
    landUseTax: zLandUseTaxPartial,
    funding: zFundingPartial,
    privacy: zPrivacyPartial,
    proxy: zProxyPartial,
  })
  .partial();

export const zAssistantResponse = z.object({
  assistantMessage: z.string().min(1),
  extractedFields: zExtractedFull,
  missingFields: z.array(z.string()),
  isComplete: z.boolean(),
  confidence: z.record(z.string(), zConfidence).optional(),
});

export type AssistantResponse = z.infer<typeof zAssistantResponse>;
export type ExtractedFields = z.infer<typeof zExtractedFull>;

function bucketsForCase(caseType: CaseType): Record<string, z.ZodTypeAny> {
  const application = zApplicationPartial;
  const funding = zFundingPartial;
  const privacy = zPrivacyPartial;
  switch (caseType) {
    case 'self-occupy':
      return {
        application,
        landUseSelf: zLandUseSelfPartial,
        funding,
        privacy,
      };
    case 'non-residential':
      return {
        application,
        landUseOther: zLandUseOtherPartial,
        funding,
        privacy,
      };
    case 'tax-deferral':
      return {
        application,
        landUseTax: zLandUseTaxPartial,
        funding,
        privacy,
      };
    case 'proxy':
      return {
        application,
        landUseSelf: zLandUseSelfPartial,
        funding,
        privacy,
        proxy: zProxyPartial,
      };
  }
}

export function buildResponseSchemaForCase(caseType: CaseType) {
  const buckets = bucketsForCase(caseType);
  const extractedShape: Record<string, z.ZodOptional<z.ZodTypeAny>> = {};
  for (const key of Object.keys(buckets)) {
    extractedShape[key] = buckets[key].optional();
  }
  return z.object({
    assistantMessage: z.string().min(1),
    extractedFields: z.object(extractedShape),
    missingFields: z.array(z.string()),
    isComplete: z.boolean(),
    confidence: z.record(z.string(), zConfidence).optional(),
  });
}

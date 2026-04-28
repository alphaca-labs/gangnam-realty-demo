import { z } from 'zod';

export const zPrivacyPartial = z
  .object({
    consent1: z.boolean(),
    consent2: z.boolean(),
    consent3: z.boolean(),
    consent4: z.boolean(),
    name: z.string(),
    birth: z.string(),
    phone: z.string(),
  })
  .partial();

export type PrivacyPartial = z.infer<typeof zPrivacyPartial>;

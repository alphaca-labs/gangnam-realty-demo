import { z } from 'zod';

export const zProxyPartial = z
  .object({
    principalName: z.string(),
    principalIdNumber: z.string(),
    principalAddress: z.string(),
    principalPhone: z.string(),
    agentName: z.string(),
    agentIdNumber: z.string(),
    agentAddress: z.string(),
    agentPhone: z.string(),
    propertyAddress: z.string(),
  })
  .partial();

export type ProxyPartial = z.infer<typeof zProxyPartial>;

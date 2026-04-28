import { z } from 'zod';

export const zApplicationPartial = z
  .object({
    sellerName: z.string(),
    sellerIdNumber: z.string(),
    sellerAddress: z.string(),
    sellerPhone: z.string(),
    buyerName: z.string(),
    buyerIdNumber: z.string(),
    buyerAddress: z.string(),
    buyerPhone: z.string(),
    rightType: z.enum(['소유권', '지상권']),
    landAddress: z.string(),
    landLotNumber: z.string(),
    landCategory: z.string(),
    landArea: z.string(),
    landZone: z.string(),
    contractAmount: z.string(),
  })
  .partial();

export type ApplicationPartial = z.infer<typeof zApplicationPartial>;

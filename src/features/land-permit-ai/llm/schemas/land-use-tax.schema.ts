import { z } from 'zod';

export const zLandUseTaxPartial = z
  .object({
    sellerIsMultiHouseOwner: z.boolean(),
    sellerHouseList: z.string(),
    sellerAcquisitionDate: z.string(),
    sellerContractDate: z.string(),
    buyerIsNoHouse: z.boolean(),
    buyerPurchasePurpose: z.string(),
    buyerMoveInPlan: z.string(),
    buyerDepositReturnPlan: z.string(),
    applicantName: z.string(),
    applicantBirth: z.string(),
    applicantPhone: z.string(),
    applicantAddress: z.string(),
    landAddress: z.string(),
    landLotNumber: z.string(),
    landCategory: z.string(),
    landArea: z.string(),
    landZone: z.string(),
  })
  .partial();

export type LandUseTaxPartial = z.infer<typeof zLandUseTaxPartial>;

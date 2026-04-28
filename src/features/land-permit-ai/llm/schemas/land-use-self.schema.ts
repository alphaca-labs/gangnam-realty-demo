import { z } from 'zod';

export const zLandUseSelfPartial = z
  .object({
    applicantName: z.string(),
    applicantBirth: z.string(),
    applicantPhone: z.string(),
    applicantAddress: z.string(),
    landAddress: z.string(),
    landLotNumber: z.string(),
    landCategory: z.string(),
    landArea: z.string(),
    landZone: z.string(),
    purchasePurpose: z.string(),
    usePlan: z.string(),
    hasExistingHouse: z.boolean(),
    existingHouseDisposal: z.string(),
    moveInDate: z.string(),
  })
  .partial();

export type LandUseSelfPartial = z.infer<typeof zLandUseSelfPartial>;

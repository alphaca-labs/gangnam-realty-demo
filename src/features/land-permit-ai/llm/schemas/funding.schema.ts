import { z } from 'zod';

export const zFundingPartial = z
  .object({
    depositAmount: z.string(),
    stockAmount: z.string(),
    giftAmount: z.string(),
    cashAmount: z.string(),
    propertyDisposalAmount: z.string(),
    compensationAmount: z.string(),
    mortgageLoan: z.string(),
    creditLoan: z.string(),
    otherLoan: z.string(),
    otherBorrowing: z.string(),
  })
  .partial();

export type FundingPartial = z.infer<typeof zFundingPartial>;

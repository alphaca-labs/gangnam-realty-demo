import type { CaseType } from '@/data/land-permit';
import {
  generateApplicationHtml,
  generateLandUseSelfHtml,
  generateLandUseOtherHtml,
  generateLandUseTaxSellerHtml,
  generateLandUseTaxBuyerHtml,
  generateFundingPlanHtml,
  generatePrivacyConsentHtml,
  generateProxyHtml,
} from '@/lib/land-permit-html';
import type { Answers } from '../types/answers';
import { mapAnswersToForms } from './answer-mapper';

export interface PreviewDocument {
  filename: string;
  html: string;
}

export function buildDocuments(caseType: CaseType, answers: Answers): PreviewDocument[] {
  const forms = mapAnswersToForms(caseType, answers);
  const docs: PreviewDocument[] = [];
  docs.push({
    filename: '01_토지거래계약_허가신청서',
    html: generateApplicationHtml(forms.application),
  });
  if (caseType === 'self-occupy' || caseType === 'proxy') {
    docs.push({
      filename: '02_토지이용계획서_자기거주용',
      html: generateLandUseSelfHtml(forms.landUseSelf),
    });
  } else if (caseType === 'non-residential') {
    docs.push({
      filename: '02_토지이용계획서_기타용',
      html: generateLandUseOtherHtml(forms.landUseOther),
    });
  } else if (caseType === 'tax-deferral') {
    docs.push({
      filename: '02-1_토지이용계획서_매도인용',
      html: generateLandUseTaxSellerHtml(forms.landUseTax),
    });
    docs.push({
      filename: '02-2_토지이용계획서_매수인용',
      html: generateLandUseTaxBuyerHtml(forms.landUseTax),
    });
  }
  docs.push({
    filename: '03_자금조달계획서',
    html: generateFundingPlanHtml(forms.funding),
  });
  docs.push({
    filename: '04_개인정보_수집이용_동의서',
    html: generatePrivacyConsentHtml(forms.privacy),
  });
  if (caseType === 'proxy') {
    docs.push({
      filename: '05_위임장',
      html: generateProxyHtml(forms.proxy),
    });
  }
  return docs;
}

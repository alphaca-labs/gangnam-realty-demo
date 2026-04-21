import type {
  ApplicationFormData,
  LandUsePlanSelfFormData,
  LandUsePlanOtherFormData,
  LandUsePlanTaxFormData,
  FundingPlanFormData,
  PrivacyConsentFormData,
  ProxyFormData,
} from '@/data/land-permit';

/* ─── Utility ─── */

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function e(str: string): string {
  return escapeHtml(str);
}

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}년 ${String(d.getMonth() + 1).padStart(2, '0')}월 ${String(d.getDate()).padStart(2, '0')}일`;
}

/* ─── Common HTML wrapper ─── */

function wrapDocument(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${e(title)}</title>
<style>
  @page { size: A4; margin: 20mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Pretendard', 'Malgun Gothic', '맑은 고딕', sans-serif;
    font-size: 11pt;
    line-height: 1.6;
    color: #1a1a1a;
    background: #fff;
    padding: 20mm;
    max-width: 210mm;
    margin: 0 auto;
  }
  h1 {
    text-align: center;
    font-size: 18pt;
    font-weight: 700;
    margin-bottom: 6mm;
    letter-spacing: 2px;
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 4mm;
  }
  h2 {
    font-size: 12pt;
    font-weight: 700;
    margin: 5mm 0 3mm;
    padding-left: 2mm;
    border-left: 3px solid #1B4D8E;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 4mm;
  }
  th, td {
    border: 1px solid #333;
    padding: 3mm 4mm;
    text-align: left;
    font-size: 10pt;
    vertical-align: top;
  }
  th {
    background: #f0f4f8;
    font-weight: 600;
    width: 25%;
    white-space: nowrap;
  }
  .header-info {
    text-align: center;
    font-size: 9pt;
    color: #666;
    margin-bottom: 4mm;
  }
  .footer {
    margin-top: 10mm;
    text-align: center;
    font-size: 10pt;
    border-top: 1px solid #ccc;
    padding-top: 5mm;
  }
  .signature-area {
    margin-top: 8mm;
    display: flex;
    justify-content: flex-end;
    gap: 20mm;
  }
  .signature-box {
    text-align: center;
    font-size: 10pt;
  }
  .signature-box .label { font-size: 9pt; color: #666; }
  .signature-box .name { margin-top: 2mm; font-weight: 600; }
  .seal { color: #c00; font-weight: 700; }
  .note {
    font-size: 9pt;
    color: #666;
    margin-top: 3mm;
    padding: 2mm 3mm;
    background: #fafafa;
    border: 1px dashed #ccc;
  }
  .checkbox { font-size: 14pt; vertical-align: middle; }
  @media print {
    body { padding: 0; }
  }
</style>
</head>
<body>
${body}
</body>
</html>`;
}

/* ─── 1. 토지거래계약 허가신청서 ─── */

export function generateApplicationHtml(data: ApplicationFormData): string {
  const body = `
<p class="header-info">[ 부동산 거래신고 등에 관한 법률 시행규칙 별지 제9호 서식 ]</p>
<h1>토지거래계약 허가신청서</h1>

<h2>매도인(양도인)</h2>
<table>
  <tr><th>성명</th><td>${e(data.sellerName)}</td><th>주민등록번호</th><td>${e(data.sellerIdNumber)}</td></tr>
  <tr><th>주소</th><td colspan="3">${e(data.sellerAddress)}</td></tr>
  <tr><th>전화번호</th><td colspan="3">${e(data.sellerPhone)}</td></tr>
</table>

<h2>매수인(양수인)</h2>
<table>
  <tr><th>성명</th><td>${e(data.buyerName)}</td><th>주민등록번호</th><td>${e(data.buyerIdNumber)}</td></tr>
  <tr><th>주소</th><td colspan="3">${e(data.buyerAddress)}</td></tr>
  <tr><th>전화번호</th><td colspan="3">${e(data.buyerPhone)}</td></tr>
</table>

<h2>허가 신청 내용</h2>
<table>
  <tr><th>허가 권리</th><td colspan="3">${e(data.rightType)}</td></tr>
</table>

<h2>토지의 표시</h2>
<table>
  <tr><th>소재지</th><td>${e(data.landAddress)}</td><th>지번</th><td>${e(data.landLotNumber)}</td></tr>
  <tr><th>지목</th><td>${e(data.landCategory)}</td><th>면적(m²)</th><td>${e(data.landArea)}</td></tr>
  <tr><th>용도지역</th><td colspan="3">${e(data.landZone)}</td></tr>
  <tr><th>계약예정금액</th><td colspan="3">${e(data.contractAmount)}원</td></tr>
</table>

<div class="note">
※ 「부동산 거래신고 등에 관한 법률」 제11조 및 같은 법 시행규칙 제8조에 따라 위와 같이 토지거래계약의 허가를 신청합니다.
</div>

<p style="text-align:center; margin-top:8mm; font-size:10pt;">${todayString()}</p>

<div class="signature-area">
  <div class="signature-box">
    <div class="label">신청인(매수인)</div>
    <div class="name">${e(data.buyerName)} <span class="seal">(인)</span></div>
  </div>
</div>

<div class="footer">
  <strong>서울특별시 강남구청장</strong> 귀하
</div>`;

  return wrapDocument('토지거래계약 허가신청서', body);
}

/* ─── 2. 토지이용계획서 (자기거주용) ─── */

export function generateLandUseSelfHtml(data: LandUsePlanSelfFormData): string {
  const body = `
<p class="header-info">[ 토지거래허가 구비서류 ]</p>
<h1>토지이용계획서 (자기거주용)</h1>

<h2>신청인 정보</h2>
<table>
  <tr><th>성명</th><td>${e(data.applicantName)}</td><th>생년월일</th><td>${e(data.applicantBirth)}</td></tr>
  <tr><th>전화번호</th><td>${e(data.applicantPhone)}</td><th>주소</th><td>${e(data.applicantAddress)}</td></tr>
</table>

<h2>토지 현황</h2>
<table>
  <tr><th>소재지</th><td>${e(data.landAddress)}</td><th>지번</th><td>${e(data.landLotNumber)}</td></tr>
  <tr><th>지목</th><td>${e(data.landCategory)}</td><th>면적(m²)</th><td>${e(data.landArea)}</td></tr>
  <tr><th>용도지역</th><td colspan="3">${e(data.landZone)}</td></tr>
</table>

<h2>이용계획</h2>
<table>
  <tr><th>매수 목적</th><td colspan="3">${e(data.purchasePurpose)}</td></tr>
  <tr><th>이용계획</th><td colspan="3">${e(data.usePlan)}</td></tr>
  <tr><th>기존 주택 유무</th><td colspan="3">${data.hasExistingHouse ? '있음' : '없음'}</td></tr>
  ${data.hasExistingHouse ? `<tr><th>기존 주택 처분계획</th><td colspan="3">${e(data.existingHouseDisposal)}</td></tr>` : ''}
  <tr><th>입주 예정일</th><td colspan="3">${e(data.moveInDate)}</td></tr>
</table>

<div class="note">
※ 위 내용은 사실과 다름이 없으며, 허가 후 이용계획대로 이행할 것을 서약합니다.<br>
※ 허가받은 목적대로 이용하지 않을 경우 이행강제금이 부과될 수 있습니다.
</div>

<p style="text-align:center; margin-top:8mm; font-size:10pt;">${todayString()}</p>

<div class="signature-area">
  <div class="signature-box">
    <div class="label">신청인</div>
    <div class="name">${e(data.applicantName)} <span class="seal">(인)</span></div>
  </div>
</div>`;

  return wrapDocument('토지이용계획서 (자기거주용)', body);
}

/* ─── 2-1. 토지이용계획서 (기타용) ─── */

export function generateLandUseOtherHtml(data: LandUsePlanOtherFormData): string {
  const body = `
<p class="header-info">[ 토지거래허가 구비서류 ]</p>
<h1>토지이용계획서 (기타 용도)</h1>

<h2>신청인 정보</h2>
<table>
  <tr><th>성명</th><td>${e(data.applicantName)}</td><th>생년월일</th><td>${e(data.applicantBirth)}</td></tr>
  <tr><th>전화번호</th><td>${e(data.applicantPhone)}</td><th>주소</th><td>${e(data.applicantAddress)}</td></tr>
</table>

<h2>토지 현황</h2>
<table>
  <tr><th>소재지</th><td>${e(data.landAddress)}</td><th>지번</th><td>${e(data.landLotNumber)}</td></tr>
  <tr><th>지목</th><td>${e(data.landCategory)}</td><th>면적(m²)</th><td>${e(data.landArea)}</td></tr>
  <tr><th>용도지역</th><td colspan="3">${e(data.landZone)}</td></tr>
</table>

<h2>이용계획</h2>
<table>
  <tr><th>매수 목적</th><td colspan="3">${e(data.purchasePurpose).replace(/\n/g, '<br>')}</td></tr>
  <tr><th>이용계획</th><td colspan="3">${e(data.usePlan).replace(/\n/g, '<br>')}</td></tr>
</table>

<div class="note">
※ 위 내용은 사실과 다름이 없으며, 허가 후 이용계획대로 이행할 것을 서약합니다.<br>
※ 허가받은 목적대로 이용하지 않을 경우 이행강제금이 부과될 수 있습니다.
</div>

<p style="text-align:center; margin-top:8mm; font-size:10pt;">${todayString()}</p>

<div class="signature-area">
  <div class="signature-box">
    <div class="label">신청인</div>
    <div class="name">${e(data.applicantName)} <span class="seal">(인)</span></div>
  </div>
</div>`;

  return wrapDocument('토지이용계획서 (기타 용도)', body);
}

/* ─── 2-2. 토지이용계획서 (양도세유예 - 매도인용) ─── */

export function generateLandUseTaxSellerHtml(data: LandUsePlanTaxFormData): string {
  const body = `
<p class="header-info">[ 토지거래허가 구비서류 - 양도세 실거주 유예 ]</p>
<h1>토지이용계획서 (매도인용)</h1>

<h2>신청인 정보</h2>
<table>
  <tr><th>성명</th><td>${e(data.applicantName)}</td><th>생년월일</th><td>${e(data.applicantBirth)}</td></tr>
  <tr><th>전화번호</th><td>${e(data.applicantPhone)}</td><th>주소</th><td>${e(data.applicantAddress)}</td></tr>
</table>

<h2>토지 현황</h2>
<table>
  <tr><th>소재지</th><td>${e(data.landAddress)}</td><th>지번</th><td>${e(data.landLotNumber)}</td></tr>
  <tr><th>지목</th><td>${e(data.landCategory)}</td><th>면적(m²)</th><td>${e(data.landArea)}</td></tr>
  <tr><th>용도지역</th><td colspan="3">${e(data.landZone)}</td></tr>
</table>

<h2>매도인 확인사항</h2>
<table>
  <tr><th>다주택 여부</th><td colspan="3">${data.sellerIsMultiHouseOwner ? '다주택자' : '1주택자'}</td></tr>
  <tr><th>보유 주택 목록</th><td colspan="3">${e(data.sellerHouseList).replace(/\n/g, '<br>')}</td></tr>
  <tr><th>취득일</th><td>${e(data.sellerAcquisitionDate)}</td><th>계약 예정일</th><td>${e(data.sellerContractDate)}</td></tr>
</table>

<div class="note">
※ 양도소득세 중과 유예를 위한 실거주 요건 확인용 서류입니다.<br>
※ 허위 기재 시 관련 법률에 따라 불이익이 발생할 수 있습니다.
</div>

<p style="text-align:center; margin-top:8mm; font-size:10pt;">${todayString()}</p>

<div class="signature-area">
  <div class="signature-box">
    <div class="label">매도인</div>
    <div class="name">${e(data.applicantName)} <span class="seal">(인)</span></div>
  </div>
</div>`;

  return wrapDocument('토지이용계획서 (매도인용 - 양도세유예)', body);
}

/* ─── 2-2. 토지이용계획서 (양도세유예 - 매수인용) ─── */

export function generateLandUseTaxBuyerHtml(data: LandUsePlanTaxFormData): string {
  const body = `
<p class="header-info">[ 토지거래허가 구비서류 - 양도세 실거주 유예 ]</p>
<h1>토지이용계획서 (매수인용)</h1>

<h2>신청인 정보</h2>
<table>
  <tr><th>성명</th><td>${e(data.applicantName)}</td><th>생년월일</th><td>${e(data.applicantBirth)}</td></tr>
  <tr><th>전화번호</th><td>${e(data.applicantPhone)}</td><th>주소</th><td>${e(data.applicantAddress)}</td></tr>
</table>

<h2>토지 현황</h2>
<table>
  <tr><th>소재지</th><td>${e(data.landAddress)}</td><th>지번</th><td>${e(data.landLotNumber)}</td></tr>
  <tr><th>지목</th><td>${e(data.landCategory)}</td><th>면적(m²)</th><td>${e(data.landArea)}</td></tr>
  <tr><th>용도지역</th><td colspan="3">${e(data.landZone)}</td></tr>
</table>

<h2>매수인 확인사항</h2>
<table>
  <tr><th>무주택 여부</th><td colspan="3">${data.buyerIsNoHouse ? '무주택자' : '유주택자'}</td></tr>
  <tr><th>매수 목적</th><td colspan="3">${e(data.buyerPurchasePurpose)}</td></tr>
  <tr><th>입주 계획</th><td colspan="3">${e(data.buyerMoveInPlan)}</td></tr>
  <tr><th>보증금 반환 계획</th><td colspan="3">${e(data.buyerDepositReturnPlan)}</td></tr>
</table>

<div class="note">
※ 양도소득세 중과 유예를 위한 실거주 요건 확인용 서류입니다.<br>
※ 실거주 의무를 이행하지 않을 경우 양도세 중과가 적용될 수 있습니다.
</div>

<p style="text-align:center; margin-top:8mm; font-size:10pt;">${todayString()}</p>

<div class="signature-area">
  <div class="signature-box">
    <div class="label">매수인</div>
    <div class="name">${e(data.applicantName)} <span class="seal">(인)</span></div>
  </div>
</div>`;

  return wrapDocument('토지이용계획서 (매수인용 - 양도세유예)', body);
}

/* ─── 3. 자금조달계획서 ─── */

export function generateFundingPlanHtml(data: FundingPlanFormData): string {
  function parseAmount(v: string): number {
    return parseInt(v.replace(/[^0-9]/g, ''), 10) || 0;
  }
  function fmt(v: string): string {
    const n = parseAmount(v);
    return n > 0 ? n.toLocaleString('ko-KR') : '0';
  }

  const selfTotal =
    parseAmount(data.depositAmount) +
    parseAmount(data.stockAmount) +
    parseAmount(data.giftAmount) +
    parseAmount(data.cashAmount) +
    parseAmount(data.propertyDisposalAmount) +
    parseAmount(data.compensationAmount);

  const borrowTotal =
    parseAmount(data.mortgageLoan) +
    parseAmount(data.creditLoan) +
    parseAmount(data.otherLoan) +
    parseAmount(data.otherBorrowing);

  const grandTotal = selfTotal + borrowTotal;

  const body = `
<p class="header-info">[ 토지거래허가 구비서류 ]</p>
<h1>자금조달계획서</h1>

<h2>1. 자기자금</h2>
<table>
  <tr><th>금융기관 예금액</th><td style="text-align:right">${fmt(data.depositAmount)}원</td></tr>
  <tr><th>주식 · 채권 매각대금</th><td style="text-align:right">${fmt(data.stockAmount)}원</td></tr>
  <tr><th>증여 · 상속</th><td style="text-align:right">${fmt(data.giftAmount)}원</td></tr>
  <tr><th>현금 등 기타</th><td style="text-align:right">${fmt(data.cashAmount)}원</td></tr>
  <tr><th>부동산 처분대금</th><td style="text-align:right">${fmt(data.propertyDisposalAmount)}원</td></tr>
  <tr><th>보상금</th><td style="text-align:right">${fmt(data.compensationAmount)}원</td></tr>
  <tr style="background:#f0f4f8; font-weight:600"><th>자기자금 소계</th><td style="text-align:right">${selfTotal.toLocaleString('ko-KR')}원</td></tr>
</table>

<h2>2. 차입금</h2>
<table>
  <tr><th>금융기관 대출 (토지담보)</th><td style="text-align:right">${fmt(data.mortgageLoan)}원</td></tr>
  <tr><th>금융기관 대출 (신용)</th><td style="text-align:right">${fmt(data.creditLoan)}원</td></tr>
  <tr><th>금융기관 대출 (기타)</th><td style="text-align:right">${fmt(data.otherLoan)}원</td></tr>
  <tr><th>기타 차입금</th><td style="text-align:right">${fmt(data.otherBorrowing)}원</td></tr>
  <tr style="background:#f0f4f8; font-weight:600"><th>차입금 소계</th><td style="text-align:right">${borrowTotal.toLocaleString('ko-KR')}원</td></tr>
</table>

<h2>3. 합계</h2>
<table>
  <tr style="background:#e8f0fe; font-weight:700; font-size:12pt"><th>조달자금 합계</th><td style="text-align:right">${grandTotal.toLocaleString('ko-KR')}원</td></tr>
</table>

<div class="note">
※ 위 자금조달계획은 사실에 근거하여 작성하였으며, 허위 기재 시 관련 법률에 의거 처벌받을 수 있습니다.
</div>

<p style="text-align:center; margin-top:8mm; font-size:10pt;">${todayString()}</p>

<div class="signature-area">
  <div class="signature-box">
    <div class="label">작성자</div>
    <div class="name">신청인 <span class="seal">(인)</span></div>
  </div>
</div>`;

  return wrapDocument('자금조달계획서', body);
}

/* ─── 4. 개인정보 수집·이용 동의서 ─── */

export function generatePrivacyConsentHtml(data: PrivacyConsentFormData): string {
  const items = [
    '개인정보의 수집 및 이용에 동의합니다.',
    '개인정보의 제3자 제공에 동의합니다.',
    '개인정보의 보유 및 이용기간에 동의합니다.',
    '고유식별정보(주민등록번호) 처리에 동의합니다.',
  ];

  const checks = [data.consent1, data.consent2, data.consent3, data.consent4];

  const body = `
<p class="header-info">[ 토지거래허가 구비서류 ]</p>
<h1>개인정보 수집·이용 동의서</h1>

<h2>동의 항목</h2>
<table>
  ${items.map((item, i) => `
  <tr>
    <td style="width:40px; text-align:center"><span class="checkbox">${checks[i] ? '☑' : '☐'}</span></td>
    <td>${e(item)}</td>
  </tr>`).join('')}
</table>

<div class="note">
<strong>수집 목적:</strong> 토지거래허가 심사<br>
<strong>수집 항목:</strong> 성명, 주민등록번호, 주소, 전화번호<br>
<strong>보유 기간:</strong> 허가 처리 완료 후 5년<br>
<strong>동의 거부권:</strong> 동의를 거부할 수 있으며, 거부 시 허가 신청이 제한될 수 있습니다.
</div>

<h2>동의인 정보</h2>
<table>
  <tr><th>성명</th><td>${e(data.name)}</td></tr>
  <tr><th>생년월일</th><td>${e(data.birth)}</td></tr>
  <tr><th>전화번호</th><td>${e(data.phone)}</td></tr>
</table>

<p style="text-align:center; margin-top:8mm; font-size:10pt;">
  위 내용을 충분히 이해하였으며, 이에 동의합니다.
</p>
<p style="text-align:center; margin-top:4mm; font-size:10pt;">${todayString()}</p>

<div class="signature-area">
  <div class="signature-box">
    <div class="label">동의인</div>
    <div class="name">${e(data.name)} <span class="seal">(인)</span></div>
  </div>
</div>`;

  return wrapDocument('개인정보 수집·이용 동의서', body);
}

/* ─── 5. 위임장 ─── */

export function generateProxyHtml(data: ProxyFormData): string {
  const body = `
<p class="header-info">[ 토지거래허가 구비서류 ]</p>
<h1>위 임 장</h1>

<h2>위임인 (본인)</h2>
<table>
  <tr><th>성명</th><td>${e(data.principalName)}</td><th>주민등록번호</th><td>${e(data.principalIdNumber)}</td></tr>
  <tr><th>주소</th><td colspan="3">${e(data.principalAddress)}</td></tr>
  <tr><th>연락처</th><td colspan="3">${e(data.principalPhone)}</td></tr>
</table>

<h2>수임인 (대리인)</h2>
<table>
  <tr><th>성명</th><td>${e(data.agentName)}</td><th>주민등록번호</th><td>${e(data.agentIdNumber)}</td></tr>
  <tr><th>주소</th><td colspan="3">${e(data.agentAddress)}</td></tr>
  <tr><th>연락처</th><td colspan="3">${e(data.agentPhone)}</td></tr>
</table>

<h2>위임 내용</h2>
<table>
  <tr><th>부동산 소재지</th><td colspan="3">${e(data.propertyAddress)}</td></tr>
  <tr><th>위임 사항</th><td colspan="3">토지거래계약 허가 신청에 관한 일체의 행위</td></tr>
</table>

<div style="margin-top:6mm; padding:4mm; border:1px solid #333; font-size:10pt; line-height:1.8;">
  본인은 위 수임인에게 상기 부동산에 대한 토지거래계약 허가 신청에 관한 일체의 권한을 위임합니다.<br>
  본 위임장에 의한 수임인의 행위는 본인의 행위와 동일한 효력을 가집니다.
</div>

<p style="text-align:center; margin-top:8mm; font-size:10pt;">${todayString()}</p>

<div class="signature-area">
  <div class="signature-box">
    <div class="label">위임인</div>
    <div class="name">${e(data.principalName)} <span class="seal">(인)</span></div>
  </div>
  <div class="signature-box">
    <div class="label">수임인</div>
    <div class="name">${e(data.agentName)} <span class="seal">(인)</span></div>
  </div>
</div>

<div class="footer">
  <strong>서울특별시 강남구청장</strong> 귀하
</div>`;

  return wrapDocument('위임장', body);
}

export function parseAmount(value: string | number | null | undefined): number {
  if (value == null) return 0;
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const digits = String(value).replace(/[^0-9]/g, '');
  if (!digits) return 0;
  const n = parseInt(digits, 10);
  return Number.isFinite(n) ? n : 0;
}

export function formatAmountInput(value: string | number): string {
  const n = parseAmount(value);
  if (n === 0) return '0';
  return n.toLocaleString('ko-KR');
}

export function formatKrw(value: string | number): string {
  const n = parseAmount(value);
  if (n === 0) return '0원';
  const eok = Math.floor(n / 100000000);
  const man = Math.floor((n % 100000000) / 10000);
  const parts: string[] = [];
  if (eok > 0) parts.push(`${eok}억`);
  if (man > 0) parts.push(`${man.toLocaleString('ko-KR')}만`);
  if (parts.length === 0) return `${n.toLocaleString('ko-KR')}원`;
  return parts.join(' ') + '원';
}

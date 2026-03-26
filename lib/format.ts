export function formatPrice(manwon: number): string {
  if (manwon >= 10000) {
    const eok = Math.floor(manwon / 10000);
    const remain = manwon % 10000;
    if (remain === 0) return `${eok}억`;
    return `${eok}억 ${remain.toLocaleString()}만`;
  }
  return `${manwon.toLocaleString()}만`;
}

export function formatWon(won: number): string {
  return won.toLocaleString() + "원";
}

export function formatArea(area: number): string {
  return `${area}㎡`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${m}.${day}`;
}

export function formatFullDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export function formatInputNumber(value: string): string {
  const num = value.replace(/[^0-9]/g, "");
  return Number(num).toLocaleString();
}

export function parseInputNumber(formatted: string): number {
  return Number(formatted.replace(/[^0-9]/g, ""));
}

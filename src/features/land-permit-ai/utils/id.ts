let counter = 0;

export function createId(prefix = 'm'): string {
  counter += 1;
  const time = Date.now().toString(36);
  const seq = counter.toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  return `${prefix}_${time}_${seq}${rand}`;
}

export function getNested(obj: Record<string, unknown>, path: string): unknown {
  if (!path) return undefined;
  const segs = path.split('.');
  let cur: unknown = obj;
  for (const s of segs) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[s];
  }
  return cur;
}

export function setNested(
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): Record<string, unknown> {
  if (!path) return obj;
  const segs = path.split('.');
  const root: Record<string, unknown> = { ...obj };
  let cur: Record<string, unknown> = root;
  for (let i = 0; i < segs.length - 1; i += 1) {
    const k = segs[i];
    const existing = cur[k];
    const next: Record<string, unknown> =
      existing && typeof existing === 'object' && !Array.isArray(existing)
        ? { ...(existing as Record<string, unknown>) }
        : {};
    cur[k] = next;
    cur = next;
  }
  cur[segs[segs.length - 1]] = value;
  return root;
}

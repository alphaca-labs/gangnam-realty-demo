import 'server-only';
import { createHash } from 'node:crypto';
import type { CombinedLandData } from './types';

interface CacheEntry {
  data: CombinedLandData;
  source: 'vworld' | 'mock';
  expiresAt: number;
}

const TTL_MS = 60 * 60 * 1000;
const MAX_ENTRIES = 100;

export class LookupCache {
  private store = new Map<string, CacheEntry>();

  private now(): number {
    return Date.now();
  }

  static hashKey(normalizedAddress: string, lotNumber: string): string {
    const raw = `${normalizedAddress.trim().toLowerCase()}|${lotNumber.trim()}`;
    return createHash('sha1').update(raw, 'utf8').digest('hex');
  }

  get(key: string): CacheEntry | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= this.now()) {
      this.store.delete(key);
      return null;
    }
    this.store.delete(key);
    this.store.set(key, entry);
    return entry;
  }

  set(key: string, data: CombinedLandData, source: 'vworld' | 'mock'): void {
    if (this.store.has(key)) {
      this.store.delete(key);
    } else if (this.store.size >= MAX_ENTRIES) {
      const oldestKey = this.store.keys().next().value;
      if (typeof oldestKey === 'string') {
        this.store.delete(oldestKey);
      }
    }
    this.store.set(key, {
      data,
      source,
      expiresAt: this.now() + TTL_MS,
    });
  }

  clear(): void {
    this.store.clear();
  }
}

let _instance: LookupCache | null = null;

export function getLookupCache(): LookupCache {
  if (!_instance) {
    _instance = new LookupCache();
  }
  return _instance;
}

'use client';

const ENC_KEY_STORAGE = 'gangnam-realty:land-permit-ai:enc-key:v1';

export interface EncryptedEnvelope {
  v: 'enc1';
  iv: string; // base64
  ct: string; // base64
}

function bytesToBase64(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.byteLength; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

function base64ToBytes(b64: string): Uint8Array<ArrayBuffer> {
  const s = atob(b64);
  const buf = new ArrayBuffer(s.length);
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
  return bytes as Uint8Array<ArrayBuffer>;
}

export function isCryptoAvailable(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof crypto !== 'undefined' &&
    !!crypto.subtle &&
    typeof window.localStorage !== 'undefined'
  );
}

async function loadKey(): Promise<CryptoKey | null> {
  if (!isCryptoAvailable()) return null;
  try {
    const raw = window.localStorage.getItem(ENC_KEY_STORAGE);
    if (raw) {
      const jwk = JSON.parse(raw) as JsonWebKey;
      return await crypto.subtle.importKey(
        'jwk',
        jwk,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt'],
      );
    }
  } catch {
    // fall through to regenerate
  }
  return null;
}

async function generateKey(): Promise<CryptoKey | null> {
  if (!isCryptoAvailable()) return null;
  try {
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt'],
    );
    const jwk = await crypto.subtle.exportKey('jwk', key);
    window.localStorage.setItem(ENC_KEY_STORAGE, JSON.stringify(jwk));
    return key;
  } catch {
    return null;
  }
}

// AES-GCM 키를 같은 origin localStorage에 보관하므로 디바이스 단위 보호일 뿐, XSS/디바이스 접근자에 대해서는 취약하다. 평문 grep·백업 dump 차단이 목적.
export async function getOrCreateKey(): Promise<CryptoKey | null> {
  if (!isCryptoAvailable()) return null;
  const existing = await loadKey();
  if (existing) return existing;
  return await generateKey();
}

export async function encryptJson(data: unknown): Promise<EncryptedEnvelope | null> {
  const key = await getOrCreateKey();
  if (!key) return null;
  try {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const plaintext = new TextEncoder().encode(JSON.stringify(data));
    const ciphertext = new Uint8Array(
      await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext),
    );
    return { v: 'enc1', iv: bytesToBase64(iv), ct: bytesToBase64(ciphertext) };
  } catch {
    return null;
  }
}

export async function decryptJson<T>(envelope: EncryptedEnvelope): Promise<T | null> {
  const key = await getOrCreateKey();
  if (!key) return null;
  try {
    const iv = base64ToBytes(envelope.iv);
    const ct = base64ToBytes(envelope.ct);
    const plaintext = new Uint8Array(
      await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct),
    );
    const json = new TextDecoder().decode(plaintext);
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export function clearEncKey(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(ENC_KEY_STORAGE);
  } catch {
    /* ignore */
  }
}

export function isEncryptedEnvelope(v: unknown): v is EncryptedEnvelope {
  if (!v || typeof v !== 'object') return false;
  const e = v as Partial<EncryptedEnvelope>;
  return e.v === 'enc1' && typeof e.iv === 'string' && typeof e.ct === 'string';
}

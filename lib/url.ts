// lib/url.ts
// Burada gerekli tip importunu yapıyoruz
import type { ReadonlyURLSearchParams } from "next/navigation";

/**
 * URL parametrelerini encode eder.
 */
export function encodeParams(obj: Record<string, any>): string {
  const q = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    q.set(k, String(v));
  });
  return q.toString();
}

/**
 * Next.js SearchParams objesini normal objeye çevirir.
 */
export function parseSearch(
  searchParams: ReadonlyURLSearchParams
): Record<string, string> {
  const obj: Record<string, string> = {};
  searchParams.forEach((v: string, k: string) => {
    obj[k] = v;
  });
  return obj;
}

export function toNumber(v: string | undefined, fallback: number): number {
  if (v === undefined) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function toEnum<const T extends readonly string[]>(
  v: string | undefined,
  allowed: T,
  fallback: T[number]
): T[number] {
  if (v && allowed.includes(v as T[number])) {
    return v as T[number];
  }
  return fallback;
}
// Uses the Web Crypto API (not Node's `crypto` module) so this works
// identically in Edge middleware and in Node.js server actions.
const encoder = new TextEncoder();

export const ADMIN_SESSION_COOKIE = 'admin_session';

export function authConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD) && Boolean(process.env.ADMIN_SESSION_SECRET);
}

// Returns null when the env vars are missing, so nothing can ever match.
// (Before, a missing password made the token the hash of "undefined:undefined",
// which anyone could compute and use as a cookie.)
export async function computeSessionToken(): Promise<string | null> {
  if (!authConfigured()) return null;
  const secret = `${process.env.ADMIN_PASSWORD}:${process.env.ADMIN_SESSION_SECRET}`;
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(secret));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Compares in constant time so response timing does not leak how many
// leading characters were right.
export function safeEqual(a: string, b: string): boolean {
  const ea = encoder.encode(a);
  const eb = encoder.encode(b);
  let diff = ea.length ^ eb.length;
  const len = Math.max(ea.length, eb.length);
  for (let i = 0; i < len; i++) diff |= (ea[i] ?? 0) ^ (eb[i] ?? 0);
  return diff === 0;
}

export async function isValidSession(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue) return false;
  const expected = await computeSessionToken();
  return expected !== null && safeEqual(cookieValue, expected);
}

// Only allow redirects to paths on this site ("/private"), never "//evil.com" or "https://...".
export function safeNextPath(next: unknown): string {
  if (typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') && !next.includes('\\')) {
    return next;
  }
  return '/admin';
}

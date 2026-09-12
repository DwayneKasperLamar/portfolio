// Uses the Web Crypto API (not Node's `crypto` module) so this works
// identically in Edge middleware and in Node.js server actions.
const encoder = new TextEncoder();

export const ADMIN_SESSION_COOKIE = 'admin_session';

export async function computeSessionToken(): Promise<string> {
  const secret = `${process.env.ADMIN_PASSWORD}:${process.env.ADMIN_SESSION_SECRET}`;
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(secret));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

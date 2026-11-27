import { createHash } from 'node:crypto';
import { headers } from 'next/headers';

// A scrambled network address: enough to limit how often one visitor can send, without storing it.
export function senderHash(): string {
  const h = headers();
  const address = h.get('x-forwarded-for')?.split(',')[0].trim() || h.get('x-real-ip') || 'unknown';
  return createHash('sha256').update(`${address}:${process.env.ADMIN_SESSION_SECRET ?? 'portfolio'}`).digest('hex');
}

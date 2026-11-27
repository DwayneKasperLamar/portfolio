'use server';

// The ONLY action a stranger can call that writes to the database. Keep every guard here.
import { createHash } from 'node:crypto';
import { headers } from 'next/headers';
import { MESSAGE_LIMITS as L, sendAlert } from '@/lib/messages';
import { getSupabase } from '@/lib/supabase';

export type SendState = { status: 'idle' | 'sent' | 'error'; message?: string };

const fail = (message: string): SendState => ({ status: 'error', message });
const GENERIC = 'The message was not sent. Please try again, or email me directly.';
const TOO_MANY = 'That is a lot of messages. Please email me directly instead.';

// A scrambled network address: enough to count messages per visitor without storing the address.
function senderHash(): string {
  const h = headers();
  const address = h.get('x-forwarded-for')?.split(',')[0].trim() || h.get('x-real-ip') || 'unknown';
  return createHash('sha256').update(`${address}:${process.env.ADMIN_SESSION_SECRET ?? 'portfolio'}`).digest('hex');
}

export async function sendMessage(_previous: SendState, formData: FormData): Promise<SendState> {
  const text = (key: string) => String(formData.get(key) ?? '').trim();

  // Trap field: people never see it, simple robots fill it in. Pretend all went well.
  if (text('website')) return { status: 'sent' };

  const name = text('name');
  const email = text('email');
  const body = text('body');
  if (!name || name.length > L.name) return fail('Please add your name.');
  if (email.length > L.email || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) return fail('Please check your email address.');
  if (!body) return fail('Please write a short message.');
  if (body.length > L.body) return fail(`Please keep it under ${L.body} characters.`);

  const db = getSupabase();
  const sender = senderHash();
  const since = (hours: number) => new Date(Date.now() - hours * 3_600_000).toISOString();

  // If the counting itself fails, refuse: never accept unlimited messages by accident.
  const mine = await db.from('messages').select('id').eq('sender_hash', sender).gte('created_at', since(1)).limit(L.perSenderPerHour);
  if (mine.error) return fail(GENERIC);
  if (mine.data.length >= L.perSenderPerHour) return fail(TOO_MANY);

  const today = await db.from('messages').select('id').gte('created_at', since(24)).limit(L.everyonePerDay);
  if (today.error) return fail(GENERIC);
  if (today.data.length >= L.everyonePerDay) return fail(TOO_MANY);

  const { error } = await db.from('messages').insert({ name, email, body, sender_hash: sender });
  if (error) return fail(GENERIC);

  await sendAlert({ name, email, body });
  return { status: 'sent' };
}

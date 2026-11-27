'use server';

// Public write actions: anyone can send an enquiry or ask for a call about a job offer.
// Keep every guard here.
import {
  BUDGETS, ENQUIRY_LIMITS as L, NEEDS, NOT_GIVEN, OFFER_NEED, REPLY_HOURS, STARTS, openSlots, partsIn,
} from '@/lib/booking';
import { getBlockedDays, getBookingSettings, getBusyTimes, paymentsReady } from '@/lib/enquiries';
import { sendOwnerAlert } from '@/lib/messages';
import { senderHash } from '@/lib/sender';
import { getSupabase } from '@/lib/supabase';

export type EnquiryState = { status: 'idle' | 'sent' | 'error'; message?: string };

const fail = (message: string): EnquiryState => ({ status: 'error', message });
const GENERIC = 'It was not sent. Please try again, or email me directly.';
const TOO_MANY = 'That is a lot of requests. Please email me directly instead.';

const reader = (formData: FormData) => (key: string) => String(formData.get(key) ?? '').trim();

// The part both paths ask for: who they are, where they are, and what it is about.
function person(text: (key: string) => string, about: string) {
  // Every field is required: nothing is stored unless the picture is complete.
  const short = [
    ['name', 'your name'], ['company', 'your company or project'], ['job_role', 'your role'], ['country', 'your country'], ['city', 'your city'],
  ] as const;
  const values: Record<string, string> = {};
  for (const [key, label] of short) {
    const value = text(key);
    if (!value) return { problem: `Please add ${label}.` };
    if (value.length > L[key]) return { problem: `Please shorten ${label}.` };
    values[key] = value;
  }
  const email = text('email');
  if (email.length > L.email || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) return { problem: 'Please check your email address.' };
  const description = text('description');
  // Counted the way the database counts: an emoji is one character, not two.
  if ([...description].length < L.descriptionMin) return { problem: `Please describe ${about} in at least ${L.descriptionMin} characters.` };
  if (description.length > L.descriptionMax) return { problem: `Please keep the description under ${L.descriptionMax} characters.` };
  return { fields: { ...values, name: values.name, company: values.company, job_role: values.job_role, country: values.country, city: values.city, email, description } };
}

// Null when this visitor may still send; otherwise the reason. If the counting itself fails,
// refuse: never accept unlimited requests by accident.
async function limitProblem(sender: string): Promise<string | null> {
  const db = getSupabase();
  const since = (hours: number) => new Date(Date.now() - hours * 3_600_000).toISOString();
  const mine = await db.from('enquiries').select('id').eq('sender_hash', sender).gte('created_at', since(1)).limit(L.perSenderPerHour);
  if (mine.error) return GENERIC;
  if (mine.data.length >= L.perSenderPerHour) return TOO_MANY;
  const today = await db.from('enquiries').select('id').gte('created_at', since(24)).limit(L.everyonePerDay);
  if (today.error) return GENERIC;
  return today.data.length >= L.everyonePerDay ? TOO_MANY : null;
}

/** The consultation path. */
export async function sendEnquiry(_previous: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const text = reader(formData);

  // Trap field: people never see it, simple robots fill it in. Pretend all went well.
  if (text('website')) return { status: 'sent' };

  const who = person(text, 'it');
  if (!who.fields) return fail(who.problem!);
  const pick = (key: string, list: readonly string[]) => (list.includes(text(key)) ? text(key) : null);
  const need = pick('need', NEEDS);
  const budget = pick('budget', BUDGETS);
  const start_when = pick('start_when', STARTS);
  if (!need) return fail('Please choose what you need.');
  if (!budget) return fail('Please choose a budget.');
  if (!start_when) return fail('Please say when you want to start.');

  const sender = senderHash();
  const limit = await limitProblem(sender);
  if (limit) return fail(limit);

  const { error } = await getSupabase().from('enquiries').insert({ ...who.fields, need, budget, start_when, sender_hash: sender });
  if (error) return fail(GENERIC);

  const f = who.fields;
  await sendOwnerAlert(
    `New enquiry: ${need} from ${f.name}`,
    `${f.name} (${f.job_role}, ${f.company})\n${f.city}, ${f.country}\n${f.email}\n\n` +
      `Needs: ${need}\nBudget: ${budget}\nStart: ${start_when}\n\n${f.description}\n\nAnswer it at /admin/enquiries`,
    f.email,
  );
  return { status: 'sent' };
}

/** The job-offer path: free, with a day and time for a call. */
export async function sendOffer(_previous: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const text = reader(formData);
  if (text('website')) return { status: 'sent' };

  const who = person(text, 'the role');
  if (!who.fields) return fail(who.problem!);
  const pay = text('pay_range');
  if (pay.length > L.pay_range) return fail('Please shorten the pay range.');
  const start = text('start');
  if (!start) return fail('Please pick a day and time.');

  if (!(await paymentsReady())) return fail('Booking a call is being set up. Please email me.');
  const sender = senderHash();
  const limit = await limitProblem(sender);
  if (limit) return fail(limit);

  const db = getSupabase();
  // Held times block the calendar, so only a few may wait at once: per sender, and in all.
  // Only the last week counts, so one request left unanswered never shuts someone out for good.
  const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const mine = await db
    .from('enquiries').select('id')
    .eq('sender_hash', sender).eq('kind', 'offer').eq('status', 'new').gte('created_at', weekAgo)
    .limit(L.waitingCallsPerSender);
  if (mine.error) return fail(GENERIC);
  if (mine.data.length >= L.waitingCallsPerSender) return fail('You already have calls waiting for my answer.');
  const waiting = await db.from('bookings').select('id').eq('status', 'requested').gte('ends_at', new Date().toISOString()).limit(L.waitingCalls);
  if (waiting.error) return fail(GENERIC);
  if (waiting.data.length >= L.waitingCalls) return fail(TOO_MANY);

  const [settings, blocked, busy] = await Promise.all([getBookingSettings(), getBlockedDays(), getBusyTimes()]);
  if (busy === null) return fail(GENERIC);
  // The time must be one the page could have offered: next day or later, open, and free.
  const slot = openSlots({ ...settings, max_hours: 1 }, busy, blocked).find((s) => s.start === start);
  if (!slot) return fail('That time is no longer free. Please pick another.');

  const saved = await db
    .from('enquiries')
    .insert({ ...who.fields, kind: 'offer', need: OFFER_NEED, budget: pay || NOT_GIVEN, start_when: NOT_GIVEN, sender_hash: sender })
    .select('id')
    .single();
  if (saved.error || !saved.data) return fail(GENERIC);
  const starts = new Date(slot.start);
  const held = await db.from('bookings').insert({
    enquiry_id: saved.data.id,
    kind: 'call',
    status: 'requested',
    starts_at: starts.toISOString(),
    ends_at: new Date(starts.getTime() + 3_600_000).toISOString(),
    hours: 1,
    rate_usd: 0,
    total_usd: 0,
  });
  if (held.error) {
    // No time, no request: take the half-saved one back out.
    await db.from('enquiries').delete().eq('id', saved.data.id);
    return fail(held.error.code === '23P01' ? 'That time was just taken. Please pick another.' : GENERIC);
  }

  const f = who.fields;
  const local = partsIn(starts, settings.timezone);
  await sendOwnerAlert(
    `JOB OFFER: ${f.name}, ${f.company} (reply within ${REPLY_HOURS} hours)`,
    `${f.name} (${f.job_role}, ${f.company})\n${f.city}, ${f.country}\n${f.email}\n\n` +
      `Asks for a call: ${local.key} at ${local.hour}:00 your time\nPay range: ${pay || NOT_GIVEN}\n\n${f.description}\n\nConfirm it at /admin/enquiries`,
    f.email,
  );
  return { status: 'sent' };
}

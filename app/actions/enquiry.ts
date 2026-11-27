'use server';

// Public write action: anyone can send an enquiry. Keep every guard here.
import { BUDGETS, ENQUIRY_LIMITS as L, NEEDS, STARTS } from '@/lib/booking';
import { sendOwnerAlert } from '@/lib/messages';
import { senderHash } from '@/lib/sender';
import { getSupabase } from '@/lib/supabase';

export type EnquiryState = { status: 'idle' | 'sent' | 'error'; message?: string };

const fail = (message: string): EnquiryState => ({ status: 'error', message });
const GENERIC = 'Your enquiry was not sent. Please try again, or email me directly.';
const TOO_MANY = 'That is a lot of enquiries. Please email me directly instead.';

export async function sendEnquiry(_previous: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const text = (key: string) => String(formData.get(key) ?? '').trim();

  // Trap field: people never see it, simple robots fill it in. Pretend all went well.
  if (text('website')) return { status: 'sent' };

  // Every field is required: nothing is stored unless the picture is complete.
  const short = [
    ['name', 'your name'], ['company', 'your company or project'], ['job_role', 'your role'], ['country', 'your country'], ['city', 'your city'],
  ] as const;
  const values: Record<string, string> = {};
  for (const [key, label] of short) {
    const value = text(key);
    if (!value) return fail(`Please add ${label}.`);
    if (value.length > L[key]) return fail(`Please shorten ${label}.`);
    values[key] = value;
  }
  const email = text('email');
  if (email.length > L.email || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) return fail('Please check your email address.');

  const pick = (key: string, list: readonly string[]) => (list.includes(text(key)) ? text(key) : null);
  const need = pick('need', NEEDS);
  const budget = pick('budget', BUDGETS);
  const start_when = pick('start_when', STARTS);
  if (!need) return fail('Please choose what you need.');
  const description = text('description');
  // Counted the way the database counts: an emoji is one character, not two.
  if ([...description].length < L.descriptionMin) return fail(`Please describe it in at least ${L.descriptionMin} characters.`);
  if (description.length > L.descriptionMax) return fail(`Please keep the description under ${L.descriptionMax} characters.`);
  if (!budget) return fail('Please choose a budget.');
  if (!start_when) return fail('Please say when you want to start.');

  const db = getSupabase();
  const sender = senderHash();
  const since = (hours: number) => new Date(Date.now() - hours * 3_600_000).toISOString();

  // If the counting itself fails, refuse: never accept unlimited enquiries by accident.
  const mine = await db.from('enquiries').select('id').eq('sender_hash', sender).gte('created_at', since(1)).limit(L.perSenderPerHour);
  if (mine.error) return fail(GENERIC);
  if (mine.data.length >= L.perSenderPerHour) return fail(TOO_MANY);
  const today = await db.from('enquiries').select('id').gte('created_at', since(24)).limit(L.everyonePerDay);
  if (today.error) return fail(GENERIC);
  if (today.data.length >= L.everyonePerDay) return fail(TOO_MANY);

  const { error } = await db.from('enquiries').insert({ ...values, email, need, description, budget, start_when, sender_hash: sender });
  if (error) return fail(GENERIC);

  await sendOwnerAlert(
    `New enquiry: ${need} from ${values.name}`,
    `${values.name} (${values.job_role}, ${values.company})\n${values.city}, ${values.country}\n${email}\n\n` +
      `Needs: ${need}\nBudget: ${budget}\nStart: ${start_when}\n\n${description}\n\nAnswer it at /admin/enquiries`,
    email,
  );
  return { status: 'sent' };
}

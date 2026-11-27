'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { MAX_NOTICE_HOURS, validTimeZone } from '@/lib/booking';
import { requireOwner } from '@/lib/owner';
import { getSupabase } from '@/lib/supabase';

const text = (formData: FormData, key: string, max = 64) => String(formData.get(key) ?? '').trim().slice(0, max);
function check(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}
const whole = (value: FormDataEntryValue | null, min: number, max: number) => {
  const n = Number(value);
  return value !== null && value !== '' && Number.isInteger(n) && n >= min && n <= max ? n : null;
};
// A refused change goes back to the screen with a plain explanation (never the typed text).
const refuse = (problem: string): never => redirect(`/admin/bookings?problem=${problem}`);
function done(saved: string): never {
  revalidatePath('/admin', 'layout');
  redirect(`/admin/bookings?saved=${saved}`);
}
const settingsRow = async (fields: Record<string, unknown>) =>
  check((await getSupabase().from('booking_settings').upsert({ id: 1, ...fields })).error);

export async function setBookingStatus(formData: FormData) {
  await requireOwner();
  const status = text(formData, 'status');
  if (status !== 'paid' && status !== 'unpaid' && status !== 'cancelled') return;
  // A cancelled session stays cancelled: its time may already belong to someone else.
  check((await getSupabase().from('bookings').update({ status }).eq('id', text(formData, 'id')).neq('status', 'cancelled')).error);
  revalidatePath('/admin', 'layout');
}

export async function saveHours(formData: FormData) {
  await requireOwner();
  const open_days = [...new Set(formData.getAll('open_days').map((d) => whole(d, 0, 6)))].filter((d): d is number => d !== null).sort();
  const open_from = whole(formData.get('open_from'), 0, 23);
  const open_to = whole(formData.get('open_to'), 1, 24);
  const notice_hours = whole(formData.get('notice_hours'), 0, MAX_NOTICE_HOURS);
  const horizon_days = whole(formData.get('horizon_days'), 1, 90);
  const timezone = text(formData, 'timezone', 60);
  if (open_days.length === 0) refuse('days');
  if (open_from === null || open_to === null || open_to <= open_from) refuse('hours');
  if (notice_hours === null || horizon_days === null) refuse('range');
  if (!validTimeZone(timezone)) refuse('zone');
  await settingsRow({ open_days, open_from, open_to, notice_hours, horizon_days, timezone });
  done('hours');
}

export async function savePrice(formData: FormData) {
  await requireOwner();
  const raw = text(formData, 'rate_usd', 12);
  const rate = raw ? Math.round(Number(raw) * 100) / 100 : null; // empty = booking closed
  const max_hours = whole(formData.get('max_hours'), 1, 8);
  if (rate !== null && !(rate > 0 && rate <= 10_000)) refuse('rate');
  if (max_hours === null) refuse('length');
  await settingsRow({ rate_usd: rate, max_hours });
  done('price');
}

const DAY = /^\d{4}-\d{2}-\d{2}$/;
const realDay = (day: string) => DAY.test(day) && !Number.isNaN(Date.parse(`${day}T00:00:00Z`)) && new Date(`${day}T00:00:00Z`).toISOString().startsWith(day);

export async function blockDay(formData: FormData) {
  await requireOwner();
  const day = text(formData, 'day', 10);
  if (!realDay(day) || Date.parse(`${day}T00:00:00Z`) < Date.now() - 2 * 86_400_000) refuse('day');
  check((await getSupabase().from('blocked_days').upsert({ day })).error);
  done('blocked');
}

export async function unblockDay(formData: FormData) {
  await requireOwner();
  const day = text(formData, 'day', 10);
  if (!realDay(day)) return;
  check((await getSupabase().from('blocked_days').delete().eq('day', day)).error);
  revalidatePath('/admin', 'layout');
}

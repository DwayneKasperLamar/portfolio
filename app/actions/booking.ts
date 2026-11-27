'use server';

// Actions for a client who holds a secret booking link. The link is the only key: every call
// checks it again, and a client can only ever touch their own payments and sessions.
// Order: they say they paid, you confirm it, and only then can they pick a time.
import { revalidatePath } from 'next/cache';
import { ENQUIRY_LIMITS as L, nextDayStart, openSlots, partsIn, usd } from '@/lib/booking';
import { getBlockedDays, getBookingSettings, getBusyTimes, getEnquiryByToken, getPaymentsFor } from '@/lib/enquiries';
import { sendOwnerAlert } from '@/lib/messages';
import { getSupabase } from '@/lib/supabase';

export type BookingState = { status: 'idle' | 'done' | 'error'; message?: string };

const fail = (message: string): BookingState => ({ status: 'error', message });
const NOT_ACTIVE = 'This booking link is not active.';
const NOT_SAVED = 'It was not saved. Please try again.';
const text = (formData: FormData, key: string) => String(formData.get(key) ?? '').slice(0, 100);

/** "I have paid": tells the owner to check. It unlocks nothing by itself. */
export async function claimPayment(_previous: BookingState, formData: FormData): Promise<BookingState> {
  const token = text(formData, 'token');
  const hours = Number(formData.get('hours'));
  const enquiry = await getEnquiryByToken(token);
  if (!enquiry) return fail(NOT_ACTIVE);

  const settings = await getBookingSettings();
  if (!settings.rate_usd) return fail('Booking is not open right now. I will email you.');
  if (!Number.isInteger(hours) || hours < 1 || hours > settings.max_hours) return fail('Please choose how long.');

  const payments = await getPaymentsFor(enquiry.id);
  if (payments.some((p) => p.status === 'claimed')) return fail('I am already checking a payment from you.');
  const dayAgo = Date.now() - 86_400_000;
  if (payments.filter((p) => Date.parse(p.created_at) > dayAgo).length >= L.claimsPerDay) return fail('Please email me about your payment.');

  const total = Math.round(settings.rate_usd * hours * 100) / 100; // the server sets the price
  const { error } = await getSupabase().from('payments').insert({ enquiry_id: enquiry.id, hours, rate_usd: settings.rate_usd, total_usd: total });
  // 23505: the database allows only one waiting payment per client.
  if (error) return fail(error.code === '23505' ? 'I am already checking a payment from you.' : NOT_SAVED);

  await sendOwnerAlert(
    `Payment to check: ${enquiry.name}, ${usd(total)}`,
    `${enquiry.name} (${enquiry.company}) says they paid ${usd(total)} for ${hours} hour(s).\n` +
      `Check your payment account, then press "Payment received" at /admin/enquiries`,
    enquiry.email,
  );
  revalidatePath(`/book/${token}`);
  return { status: 'done' };
}

/** Picks the time for a payment the owner has confirmed. */
export async function bookSession(_previous: BookingState, formData: FormData): Promise<BookingState> {
  const token = text(formData, 'token');
  const start = text(formData, 'start');
  const enquiry = await getEnquiryByToken(token);
  if (!enquiry) return fail(NOT_ACTIVE);

  const payment = (await getPaymentsFor(enquiry.id)).find((p) => p.id === text(formData, 'payment') && p.status === 'confirmed');
  if (!payment) return fail('There is no confirmed payment to book with.');

  const [settings, blocked, busy] = await Promise.all([getBookingSettings(), getBlockedDays(), getBusyTimes()]);
  if (busy === null) return fail(NOT_SAVED);
  // The time must be one the page could have offered: next day or later, open, free and long enough.
  const longEnough = { ...settings, max_hours: Math.max(settings.max_hours, payment.hours) };
  const slot = openSlots(longEnough, busy, blocked).find((s) => s.start === start);
  if (!slot || slot.maxHours < payment.hours) return fail('That time is no longer free. Please pick another.');

  const db = getSupabase();
  // Use the payment up first. Only one request can win this, so a double click books once.
  const taken = await db.from('payments').update({ status: 'used' }).eq('id', payment.id).eq('enquiry_id', enquiry.id).eq('status', 'confirmed').select('id');
  if (taken.error || taken.data.length !== 1) return fail('This payment has already been used.');

  const starts = new Date(slot.start);
  const saved = await db
    .from('bookings')
    .insert({
      enquiry_id: enquiry.id,
      kind: 'consultation',
      status: 'paid',
      starts_at: starts.toISOString(),
      ends_at: new Date(starts.getTime() + payment.hours * 3_600_000).toISOString(),
      hours: payment.hours,
      rate_usd: payment.rate_usd,
      total_usd: payment.total_usd,
    })
    .select('id')
    .single();
  if (saved.error || !saved.data) {
    await db.from('payments').update({ status: 'confirmed' }).eq('id', payment.id); // give the payment back
    return fail(saved.error?.code === '23P01' ? 'That time was just taken. Please pick another.' : NOT_SAVED);
  }
  await db.from('payments').update({ booking_id: saved.data.id }).eq('id', payment.id);

  const local = partsIn(starts, settings.timezone);
  await sendOwnerAlert(
    `Session booked: ${enquiry.name}, ${local.key}`,
    `${enquiry.name} (${enquiry.company}) booked ${payment.hours} hour(s) on ${local.key} at ${local.hour}:00 your time.\n\n/admin/bookings`,
    enquiry.email,
  );
  revalidatePath(`/book/${token}`);
  return { status: 'done' };
}

/** Frees a paid session's time so the client can pick another. Not on the day itself. */
export async function changeTime(formData: FormData): Promise<void> {
  const token = text(formData, 'token');
  const enquiry = await getEnquiryByToken(token);
  if (!enquiry) return;
  const settings = await getBookingSettings();
  const db = getSupabase();
  // Only their own paid session, and only if it is not today or already past.
  const freed = await db
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', text(formData, 'id'))
    .eq('enquiry_id', enquiry.id)
    .eq('status', 'paid')
    .gte('starts_at', nextDayStart(settings.timezone).toISOString())
    .select('id,starts_at');
  if (freed.error || freed.data.length !== 1) return;
  await db.from('payments').update({ status: 'confirmed', booking_id: null }).eq('booking_id', freed.data[0].id).eq('enquiry_id', enquiry.id);

  const local = partsIn(new Date(freed.data[0].starts_at), settings.timezone);
  await sendOwnerAlert(
    `Session cancelled: ${enquiry.name}, ${local.key}`,
    `${enquiry.name} (${enquiry.company}) cancelled the session on ${local.key} at ${local.hour}:00 your time, to pick another.\n\n/admin/bookings`,
    enquiry.email,
  );
  revalidatePath(`/book/${token}`);
}

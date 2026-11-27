'use server';

// Actions for a client who holds a secret booking link. The link is the only key: every call
// checks it again, and a client can only ever touch their own bookings.
import { revalidatePath } from 'next/cache';
import { ENQUIRY_LIMITS, openSlots, partsIn, usd } from '@/lib/booking';
import { getBlockedDays, getBookingSettings, getBookingsFor, getBusyTimes, getEnquiryByToken } from '@/lib/enquiries';
import { sendOwnerAlert } from '@/lib/messages';
import { getSupabase } from '@/lib/supabase';

export type BookingState = { status: 'idle' | 'booked' | 'error'; message?: string };

const fail = (message: string): BookingState => ({ status: 'error', message });

export async function createBooking(_previous: BookingState, formData: FormData): Promise<BookingState> {
  const token = String(formData.get('token') ?? '');
  const start = String(formData.get('start') ?? '');
  const hours = Number(formData.get('hours'));

  const enquiry = await getEnquiryByToken(token);
  if (!enquiry) return fail('This booking link is not active.');
  if (!Number.isInteger(hours) || hours < 1) return fail('Please choose how long.');

  const [settings, blocked, busy, mine] = await Promise.all([getBookingSettings(), getBlockedDays(), getBusyTimes(), getBookingsFor(enquiry.id)]);
  if (!settings.rate_usd || busy === null) return fail('Booking is not open right now. I will email you.');
  if (mine.filter((b) => b.status === 'unpaid' && Date.parse(b.ends_at) > Date.now()).length >= ENQUIRY_LIMITS.activeUnpaid) {
    return fail('You already have sessions waiting for payment. Please pay or cancel one first.');
  }

  // The time must be one the page could have offered: open day and hour, enough notice, free.
  const slot = openSlots(settings, busy, blocked).find((s) => s.start === start);
  if (!slot || hours > slot.maxHours) return fail('That time is no longer free. Please pick another.');

  const starts = new Date(slot.start);
  const total = Math.round(settings.rate_usd * hours * 100) / 100; // the server sets the price
  const { error } = await getSupabase().from('bookings').insert({
    enquiry_id: enquiry.id,
    starts_at: starts.toISOString(),
    ends_at: new Date(starts.getTime() + hours * 3_600_000).toISOString(),
    hours,
    rate_usd: settings.rate_usd,
    total_usd: total,
  });
  // 23P01: the database refused an overlap, so someone else took it a moment ago.
  if (error) return fail(error.code === '23P01' ? 'That time was just taken. Please pick another.' : 'The booking was not saved. Please try again.');

  const local = partsIn(starts, settings.timezone);
  await sendOwnerAlert(
    `New booking: ${enquiry.name}, ${local.key}`,
    `${enquiry.name} (${enquiry.company}) booked ${hours} hour(s) on ${local.key} at ${local.hour}:00 your time.\nTotal ${usd(total)}, not yet paid.\n\n/admin/bookings`,
    enquiry.email,
  );
  revalidatePath(`/book/${token}`);
  return { status: 'booked' };
}

export async function cancelBooking(formData: FormData): Promise<void> {
  const token = String(formData.get('token') ?? '');
  const enquiry = await getEnquiryByToken(token);
  if (!enquiry) return;
  // Only their own, only before payment, and only before it starts: a call that happened stays on record.
  await getSupabase()
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', String(formData.get('id') ?? '').slice(0, 64))
    .eq('enquiry_id', enquiry.id)
    .eq('status', 'unpaid')
    .gt('starts_at', new Date().toISOString());
  revalidatePath(`/book/${token}`);
}

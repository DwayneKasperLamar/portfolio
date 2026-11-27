'use server';

import { randomBytes } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getBookingSettings } from '@/lib/enquiries';
import { requireOwner } from '@/lib/owner';
import { getSupabase } from '@/lib/supabase';

const idOf = (formData: FormData, key = 'id') => String(formData.get(key) ?? '').slice(0, 64);
function check(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}
const refresh = () => revalidatePath('/admin', 'layout');
const now = () => new Date().toISOString();

// Frees calendar time held for someone, from now on. Paid sessions are never touched here.
async function releaseTimes(enquiryId: string, statuses: string[]) {
  check(
    (await getSupabase().from('bookings').update({ status: 'cancelled' }).eq('enquiry_id', enquiryId).in('status', statuses).gte('ends_at', now())).error,
  );
}

/** Creates the client's secret booking link. Consultations only: a job offer never gets a payment page. */
export async function acceptEnquiry(formData: FormData) {
  await requireOwner();
  const db = getSupabase();
  const id = idOf(formData);
  const found = await db.from('enquiries').select('*').eq('id', id).maybeSingle();
  check(found.error);
  if (!found.data || found.data.kind === 'offer') return;
  // An already accepted enquiry keeps its link: pressing twice must not break the one you sent.
  check(
    (await db.from('enquiries').update({ status: 'accepted', booking_token: randomBytes(32).toString('hex') }).eq('id', id).neq('status', 'accepted')).error,
  );
  refresh();
}

/** Declines, switches off any booking link and frees any time held. */
export async function declineEnquiry(formData: FormData) {
  await requireOwner();
  const id = idOf(formData);
  check((await getSupabase().from('enquiries').update({ status: 'declined', booking_token: null }).eq('id', id)).error);
  await releaseTimes(id, ['unpaid', 'requested', 'confirmed']);
  refresh();
}

export async function reopenEnquiry(formData: FormData) {
  await requireOwner();
  check((await getSupabase().from('enquiries').update({ status: 'new', booking_token: null }).eq('id', idOf(formData)).eq('status', 'declined')).error);
  refresh();
}

/** Removes the enquiry, its bookings and its payment records for good. */
export async function deleteEnquiry(formData: FormData) {
  await requireOwner();
  check((await getSupabase().from('enquiries').delete().eq('id', idOf(formData))).error);
  refresh();
  redirect('/admin/enquiries');
}

// ---- Job offers --------------------------------------------------------------------

export async function confirmCall(formData: FormData) {
  await requireOwner();
  const id = idOf(formData);
  const db = getSupabase();
  const held = await db
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('enquiry_id', id)
    .eq('status', 'requested')
    .gte('ends_at', now())
    .select('id');
  check(held.error);
  // Nothing held any more (cancelled or past): there is no call to confirm.
  if (!held.data?.length) return;
  check((await db.from('enquiries').update({ status: 'accepted' }).eq('id', id).eq('status', 'new')).error);
  refresh();
}

/** Frees the held time so another can be agreed by email. */
export async function releaseCall(formData: FormData) {
  await requireOwner();
  await releaseTimes(idOf(formData), ['requested', 'confirmed']);
  refresh();
}

// ---- Consultation payments ------------------------------------------------------------

async function setPayment(formData: FormData, from: string, to: string) {
  await requireOwner();
  check((await getSupabase().from('payments').update({ status: to }).eq('id', idOf(formData)).eq('status', from)).error);
  refresh();
}
/** "Payment received": the client may now pick a time. */
export async function confirmPayment(formData: FormData) {
  await setPayment(formData, 'claimed', 'confirmed');
}
/** "Not yet": the client is told it has not been found. */
export async function rejectPayment(formData: FormData) {
  await setPayment(formData, 'claimed', 'rejected');
}

/** Records money you received without the client pressing "I have paid". */
export async function addPaidHours(formData: FormData) {
  await requireOwner();
  const id = idOf(formData);
  const hours = Number(formData.get('hours'));
  const settings = await getBookingSettings();
  const db = getSupabase();
  const found = await db.from('enquiries').select('*').eq('id', id).eq('status', 'accepted').maybeSingle();
  check(found.error);
  if (!found.data || found.data.kind === 'offer' || !settings.rate_usd || !Number.isInteger(hours) || hours < 1 || hours > 8) return;
  const total = Math.round(settings.rate_usd * hours * 100) / 100;
  check((await db.from('payments').insert({ enquiry_id: id, hours, rate_usd: settings.rate_usd, total_usd: total, status: 'confirmed' })).error);
  refresh();
}

/** Takes unused paid hours away, for example after a refund. A payment already used for a session stays. */
export async function removePayment(formData: FormData) {
  await requireOwner();
  check((await getSupabase().from('payments').delete().eq('id', idOf(formData)).in('status', ['claimed', 'confirmed', 'rejected'])).error);
  refresh();
}

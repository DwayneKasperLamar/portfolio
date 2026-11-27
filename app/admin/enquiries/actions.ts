'use server';

import { randomBytes } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireOwner } from '@/lib/owner';
import { getSupabase } from '@/lib/supabase';

const idOf = (formData: FormData) => String(formData.get('id') ?? '').slice(0, 64);
function check(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}
const refresh = () => revalidatePath('/admin', 'layout');

// Sessions not paid for are freed when a client loses their link. Paid ones are left for you to settle.
async function cancelUnpaid(enquiryId: string) {
  check(
    (
      await getSupabase()
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('enquiry_id', enquiryId)
        .eq('status', 'unpaid')
        .gte('ends_at', new Date().toISOString())
    ).error,
  );
}

/** Creates the client's secret booking link. */
export async function acceptEnquiry(formData: FormData) {
  await requireOwner();
  // An already accepted enquiry keeps its link: pressing twice must not break the one you sent.
  check(
    (
      await getSupabase()
        .from('enquiries')
        .update({ status: 'accepted', booking_token: randomBytes(32).toString('hex') })
        .eq('id', idOf(formData))
        .neq('status', 'accepted')
    ).error,
  );
  refresh();
}

/** Declines, and switches off any booking link. */
export async function declineEnquiry(formData: FormData) {
  await requireOwner();
  const id = idOf(formData);
  check((await getSupabase().from('enquiries').update({ status: 'declined', booking_token: null }).eq('id', id)).error);
  await cancelUnpaid(id);
  refresh();
}

export async function reopenEnquiry(formData: FormData) {
  await requireOwner();
  check((await getSupabase().from('enquiries').update({ status: 'new', booking_token: null }).eq('id', idOf(formData)).eq('status', 'declined')).error);
  refresh();
}

/** Removes the enquiry and its bookings for good. */
export async function deleteEnquiry(formData: FormData) {
  await requireOwner();
  check((await getSupabase().from('enquiries').delete().eq('id', idOf(formData))).error);
  refresh();
  redirect('/admin/enquiries');
}

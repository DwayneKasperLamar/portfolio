'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireOwner } from '@/lib/owner';
import { getSupabase } from '@/lib/supabase';

const text = (formData: FormData, key: string) => String(formData.get(key) ?? '').trim();

/** How clients pay: shown only on their private booking page. */
export async function savePayment(formData: FormData) {
  await requireOwner();
  const link = text(formData, 'payment_link');
  const note = text(formData, 'payment_note');
  // Only a secure web address: this becomes a "Pay" button.
  if (link && (link.length > 500 || !/^https:\/\/[^\s]+$/.test(link))) redirect('/admin/settings?problem=link');
  if (note.length > 500) redirect('/admin/settings?problem=note');
  const { error } = await getSupabase().from('booking_settings').upsert({ id: 1, payment_link: link || null, payment_note: note || null });
  if (error) throw new Error(error.message);
  revalidatePath('/admin', 'layout');
  redirect('/admin/settings?saved=payment');
}

/** The meeting link put into the email that confirms a job-offer call. */
export async function saveCallLink(formData: FormData) {
  await requireOwner();
  const link = text(formData, 'call_link');
  if (link && (link.length > 500 || !/^https:\/\/[^\s]+$/.test(link))) redirect('/admin/settings?problem=call');
  const { error } = await getSupabase().from('booking_settings').upsert({ id: 1, call_link: link || null });
  if (error) throw new Error(error.message);
  revalidatePath('/admin', 'layout');
  redirect('/admin/settings?saved=call');
}

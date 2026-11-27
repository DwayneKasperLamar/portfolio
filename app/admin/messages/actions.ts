'use server';

import { revalidatePath } from 'next/cache';
import { requireOwner } from '@/lib/owner';
import { getSupabase } from '@/lib/supabase';
import { LISTS } from '@/lib/content';

const idOf = (formData: FormData) => String(formData.get('id') ?? '').slice(0, 64);
function check(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export async function setMessageRead(formData: FormData) {
  await requireOwner();
  check((await getSupabase().from('messages').update({ is_read: formData.get('read') === 'yes' }).eq('id', idOf(formData))).error);
  revalidatePath('/admin', 'layout');
}

export async function deleteMessage(formData: FormData) {
  await requireOwner();
  check((await getSupabase().from('messages').delete().eq('id', idOf(formData))).error);
  revalidatePath('/admin', 'layout');
}

/** Saves the WhatsApp number as a public contact link (empty = remove the button). */
export async function saveWhatsApp(formData: FormData) {
  await requireOwner();
  const raw = String(formData.get('number') ?? '').trim();
  const digits = raw.replace(/[\s()+-]/g, '');
  if (raw && !/^[1-9]\d{7,14}$/.test(digits)) {
    throw new Error('Use the full number with the country code, for example +234 followed by the number without its first 0.');
  }

  const db = getSupabase();
  check((await db.from('collection_items').delete().eq('collection_slug', LISTS.contact).like('url', 'https://wa.me/%')).error);
  if (digits) {
    const found = await db.from('collections').select('slug').eq('slug', LISTS.contact).maybeSingle();
    check(found.error);
    if (!found.data) {
      check((await db.from('collections').insert({ slug: LISTS.contact, title: 'Contact', kind: 'other', visibility: 'public', show_in_nav: false })).error);
    }
    check(
      (await db.from('collection_items').insert({ collection_slug: LISTS.contact, title: 'WhatsApp', url: `https://wa.me/${digits}`, visibility: 'public', sort_order: 50 })).error,
    );
  }
  revalidatePath('/', 'layout');
}

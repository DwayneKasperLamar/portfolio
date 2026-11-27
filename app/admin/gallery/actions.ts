'use server';

import { revalidatePath } from 'next/cache';
import { requireOwner } from '@/lib/owner';
import { getSupabase } from '@/lib/supabase';
import { MEDIA_BUCKET, MEDIA_NAME } from '@/lib/upload-rules';
import { safeUrl } from '@/lib/safe-url';

// The gallery page adds to this list; it is an ordinary collection of type "Gallery".
const GALLERY = 'gallery';

function str(formData: FormData, key: string, max: number): string {
  const value = String(formData.get(key) ?? '').trim();
  if (value.length > max) throw new Error(`"${key}" is too long (max ${max} characters).`);
  return value;
}
function check(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}
const refresh = () => revalidatePath('/', 'layout');
const asVisibility = (value: unknown) => (value === 'public' ? 'public' : 'private');

async function insertItem(values: { title: string; image_url: string | null; url: string | null; visibility: string }) {
  const db = getSupabase();
  const found = await db.from('collections').select('slug').eq('slug', GALLERY).maybeSingle();
  check(found.error);
  if (!found.data) {
    // The list itself is public; each photo has its own switch.
    check((await db.from('collections').insert({ slug: GALLERY, title: 'Gallery', kind: 'carousel', visibility: 'public', show_in_nav: false })).error);
  }
  const last = await db.from('collection_items').select('sort_order').eq('collection_slug', GALLERY).order('sort_order', { ascending: false }).limit(1);
  check(last.error);
  const sort_order = (last.data?.[0]?.sort_order ?? 0) + 1;
  check((await db.from('collection_items').insert({ ...values, collection_slug: GALLERY, sort_order })).error);
}

/** After the browser has uploaded a file, record it in the gallery. */
export async function addGalleryUpload(path: string, visibility: string) {
  await requireOwner();
  if (!path.startsWith('/media/') || !MEDIA_NAME.test(path.slice('/media/'.length))) throw new Error('Unknown file.');
  const video = /\.(mp4|webm|mov)$/.test(path);
  await insertItem({ title: video ? 'Video' : 'Photo', image_url: path, url: null, visibility: asVisibility(visibility) });
  refresh();
}

export async function addGalleryLink(formData: FormData) {
  await requireOwner();
  const url = safeUrl(str(formData, 'url', 2000));
  if (!url) throw new Error('That is not a web link (it must start with https://).');
  await insertItem({ title: str(formData, 'title', 200) || 'Video', image_url: null, url, visibility: asVisibility(formData.get('visibility')) });
  refresh();
}

export async function updateGalleryItem(formData: FormData) {
  await requireOwner();
  const title = str(formData, 'title', 200);
  if (!title) throw new Error('A title is required.');
  check(
    (await getSupabase().from('collection_items').update({ title, subtitle: str(formData, 'subtitle', 200) || null }).eq('id', str(formData, 'id', 64))).error,
  );
  refresh();
}

export async function setGalleryVisibility(formData: FormData) {
  await requireOwner();
  check(
    (await getSupabase().from('collection_items').update({ visibility: asVisibility(formData.get('visibility')) }).eq('id', str(formData, 'id', 64))).error,
  );
  refresh();
}

// Is an uploaded file still used anywhere (public or not)? Unsure counts as "yes".
async function stillUsed(ref: string): Promise<boolean> {
  const db = getSupabase();
  const places = [
    ['collection_items', 'image_url'], ['collection_items', 'url'], ['timeline_events', 'image_url'],
    ['projects', 'logo_url'], ['profile', 'avatar_url'], ['profile', 'cover_url'],
  ] as const;
  for (const [table, column] of places) {
    const { data, error } = await db.from(table).select(column).eq(column, ref).limit(1);
    if (error || (data?.length ?? 0) > 0) return true;
  }
  return false;
}

export async function deleteGalleryItem(formData: FormData) {
  await requireOwner();
  const db = getSupabase();
  const id = str(formData, 'id', 64);
  const found = await db.from('collection_items').select('image_url').eq('id', id).maybeSingle();
  check(found.error);
  check((await db.from('collection_items').delete().eq('id', id)).error);

  // Also remove the file itself, unless something else still shows it.
  const path = found.data?.image_url as string | undefined;
  if (path?.startsWith('/media/') && MEDIA_NAME.test(path.slice('/media/'.length)) && !(await stillUsed(path))) {
    await db.storage.from(MEDIA_BUCKET).remove([path.slice('/media/'.length)]);
  }
  refresh();
}

'use server';

import { revalidatePath } from 'next/cache';
import { getSupabase } from '@/lib/supabase';
import { requireOwner } from '@/lib/owner';
import { COLLECTION_KINDS, type CollectionKind, type Visibility } from '@/lib/content';

// Caps on every text input (stops a runaway paste from filling the database).
const MAX = { short: 200, medium: 1000, url: 2000, body: 100_000 } as const;

function str(formData: FormData, key: string, max: number = MAX.medium): string {
  const value = String(formData.get(key) ?? '').trim();
  if (value.length > max) throw new Error(`"${key}" is too long (max ${max} characters).`);
  return value;
}

function int(formData: FormData, key: string, fallback = 0): number {
  const n = Number(formData.get(key) ?? fallback);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

function visibility(formData: FormData): Visibility {
  // Anything unexpected becomes private: never public by accident.
  return formData.get('visibility') === 'public' ? 'public' : 'private';
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function slugFrom(formData: FormData, titleKey = 'title'): string {
  const slug = slugify(str(formData, 'slug', MAX.short) || str(formData, titleKey, MAX.short));
  if (!slug) throw new Error('A slug (or a title to make one from) is required.');
  return slug;
}

// Unlike the old silent calls, a failed write now stops with a visible error
// instead of looking like it saved.
function check(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

// The public site and the nav read many tables; refresh them all after any edit.
function refresh(...paths: string[]) {
  revalidatePath('/', 'layout');
  for (const p of paths) revalidatePath(p);
}

// ---- Profile / projects / tech --------------------------------------------------

export async function updateProfile(formData: FormData) {
  await requireOwner();
  check(
    (
      await getSupabase()
        .from('profile')
        .update({
          name: str(formData, 'name', MAX.short),
          location: str(formData, 'location', MAX.short),
          role_title: str(formData, 'role_title', MAX.short),
          current_role_text: str(formData, 'current_role_text', MAX.body),
          previous_role_text: str(formData, 'previous_role_text', MAX.body),
          now_text: str(formData, 'now_text', MAX.body),
          email: str(formData, 'email', MAX.short),
          github_url: str(formData, 'github_url', MAX.url),
          twitter_url: str(formData, 'twitter_url', MAX.url),
        })
        .eq('id', 1)
    ).error,
  );
  refresh('/admin/profile');
}

export async function upsertProject(formData: FormData) {
  await requireOwner();
  const row: Record<string, unknown> = {
    slug: str(formData, 'slug', MAX.short),
    title: str(formData, 'title', MAX.short),
    description: str(formData, 'description', MAX.medium),
    href: str(formData, 'href', MAX.url),
    logo_url: str(formData, 'logo_url', MAX.url) || null,
    sort_order: int(formData, 'sort_order'),
  };
  // Only send visibility once the form offers it (i.e. after 002_content_model.sql).
  if (formData.has('visibility')) row.visibility = visibility(formData);
  check((await getSupabase().from('projects').upsert(row)).error);
  refresh('/admin/projects');
}

export async function deleteProject(formData: FormData) {
  await requireOwner();
  check((await getSupabase().from('projects').delete().eq('slug', str(formData, 'slug', MAX.short))).error);
  refresh('/admin/projects');
}

export async function upsertTechItem(formData: FormData) {
  await requireOwner();
  const id = str(formData, 'id', MAX.short);
  const category = str(formData, 'category', MAX.short);
  if (category !== 'stack' && category !== 'skill') throw new Error('Category must be "stack" or "skill".');
  const row = {
    label: str(formData, 'label', MAX.short),
    icon_key: str(formData, 'icon_key', MAX.short),
    category,
    project_slug: str(formData, 'project_slug', MAX.short) || null,
    sort_order: int(formData, 'sort_order'),
  };

  check((id ? await getSupabase().from('tech_items').update(row).eq('id', id) : await getSupabase().from('tech_items').insert(row)).error);
  refresh('/admin/tech');
}

export async function deleteTechItem(formData: FormData) {
  await requireOwner();
  check((await getSupabase().from('tech_items').delete().eq('id', str(formData, 'id', MAX.short))).error);
  refresh('/admin/tech');
}

// ---- Pages -------------------------------------------------------------------------

export async function upsertPage(formData: FormData) {
  await requireOwner();
  const row = {
    slug: slugFrom(formData),
    title: str(formData, 'title', MAX.short),
    body: str(formData, 'body', MAX.body),
    show_in_nav: formData.get('show_in_nav') === 'on',
    nav_order: int(formData, 'nav_order'),
    visibility: visibility(formData),
    updated_at: new Date().toISOString(),
  };
  if (!row.title) throw new Error('A title is required.');
  check((await getSupabase().from('pages').upsert(row)).error);
  refresh('/admin/pages', '/private');
}

export async function deletePage(formData: FormData) {
  await requireOwner();
  check((await getSupabase().from('pages').delete().eq('slug', str(formData, 'slug', MAX.short))).error);
  refresh('/admin/pages', '/private');
}

// ---- Timeline ------------------------------------------------------------------------

export async function upsertTimelineEvent(formData: FormData) {
  await requireOwner();
  const id = str(formData, 'id', MAX.short);
  const eventDate = str(formData, 'event_date', 10);
  if (!/^\d{4}(-\d{2}(-\d{2})?)?$/.test(eventDate)) {
    throw new Error('Date must look like 2019, 2019-06 or 2019-06-12.');
  }
  const row = {
    event_date: eventDate,
    title: str(formData, 'title', MAX.short),
    body: str(formData, 'body', MAX.body),
    category: str(formData, 'category', MAX.short) || 'life',
    image_url: str(formData, 'image_url', MAX.url) || null,
    visibility: visibility(formData),
  };
  if (!row.title) throw new Error('A title is required.');
  check(
    (id ? await getSupabase().from('timeline_events').update(row).eq('id', id) : await getSupabase().from('timeline_events').insert(row))
      .error,
  );
  refresh('/admin/timeline', '/private');
}

export async function deleteTimelineEvent(formData: FormData) {
  await requireOwner();
  check((await getSupabase().from('timeline_events').delete().eq('id', str(formData, 'id', MAX.short))).error);
  refresh('/admin/timeline', '/private');
}

// ---- Journal -------------------------------------------------------------------------

export async function upsertJournalEntry(formData: FormData) {
  await requireOwner();
  const entryDate = str(formData, 'entry_date', 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(entryDate)) throw new Error('Date must look like 2026-11-25.');
  const tags = str(formData, 'tags', MAX.medium)
    .split(',')
    .map((t) => slugify(t))
    .filter(Boolean)
    .slice(0, 20);
  const row = {
    slug: slugFrom(formData),
    title: str(formData, 'title', MAX.short),
    body: str(formData, 'body', MAX.body),
    entry_date: entryDate,
    mood: str(formData, 'mood', MAX.short) || null,
    tags,
    visibility: visibility(formData),
  };
  if (!row.title) throw new Error('A title is required.');
  check((await getSupabase().from('journal_entries').upsert(row)).error);
  refresh('/admin/journal', '/private');
}

export async function deleteJournalEntry(formData: FormData) {
  await requireOwner();
  check((await getSupabase().from('journal_entries').delete().eq('slug', str(formData, 'slug', MAX.short))).error);
  refresh('/admin/journal', '/private');
}

// ---- Collections + items ---------------------------------------------------------------

export async function upsertCollection(formData: FormData) {
  await requireOwner();
  const kind = str(formData, 'kind', MAX.short) as CollectionKind;
  if (!COLLECTION_KINDS.includes(kind)) throw new Error('Unknown collection type.');
  const row = {
    slug: slugFrom(formData),
    title: str(formData, 'title', MAX.short),
    kind,
    description: str(formData, 'description', MAX.medium),
    show_in_nav: formData.get('show_in_nav') === 'on',
    sort_order: int(formData, 'sort_order'),
    visibility: visibility(formData),
  };
  if (!row.title) throw new Error('A title is required.');
  check((await getSupabase().from('collections').upsert(row)).error);
  refresh('/admin/collections', '/private');
}

export async function deleteCollection(formData: FormData) {
  await requireOwner();
  // Items are removed with it (foreign key "on delete cascade").
  check((await getSupabase().from('collections').delete().eq('slug', str(formData, 'slug', MAX.short))).error);
  refresh('/admin/collections', '/private');
}

export async function upsertCollectionItem(formData: FormData) {
  await requireOwner();
  const id = str(formData, 'id', MAX.short);
  const rating = int(formData, 'rating', 0);
  if (rating < 0 || rating > 5) throw new Error('Rating must be 0 to 5.');
  const row = {
    collection_slug: str(formData, 'collection_slug', MAX.short),
    title: str(formData, 'title', MAX.short),
    subtitle: str(formData, 'subtitle', MAX.short) || null,
    url: str(formData, 'url', MAX.url) || null,
    image_url: str(formData, 'image_url', MAX.url) || null,
    notes: str(formData, 'notes', MAX.body),
    status: str(formData, 'status', MAX.short) || null,
    rating: rating === 0 ? null : rating,
    sort_order: int(formData, 'sort_order'),
    visibility: visibility(formData),
  };
  if (!row.title) throw new Error('A title is required.');
  check(
    (id ? await getSupabase().from('collection_items').update(row).eq('id', id) : await getSupabase().from('collection_items').insert(row))
      .error,
  );
  refresh('/admin/collections', '/private');
}

export async function deleteCollectionItem(formData: FormData) {
  await requireOwner();
  check((await getSupabase().from('collection_items').delete().eq('id', str(formData, 'id', MAX.short))).error);
  refresh('/admin/collections', '/private');
}

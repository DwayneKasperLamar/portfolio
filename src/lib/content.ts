import { getSupabase } from '@/lib/supabase';

// ---------------------------------------------------------------------------
// PRIVACY RULE
// The server reads with the service-role key, which ignores database row
// rules. So the ONLY thing keeping private rows off public pages is the
// filtering in this file:
//   getPublic*  -> visibility = 'public' only. Used by every public page.
//   getOwner*   -> everything. Only call these from pages behind the owner
//                  login (/admin/*, /private/*).
// ---------------------------------------------------------------------------

export type Visibility = 'public' | 'private';

export interface Profile {
  id: number;
  name: string;
  location: string;
  role_title: string;
  current_role_text: string;
  previous_role_text: string;
  now_text: string;
  email: string;
  github_url: string;
  twitter_url: string;
  // The rest appear after supabase/003_profile_and_media.sql has been run.
  avatar_url?: string | null;
  cover_url?: string | null;
  handle?: string | null;
  bio?: string | null;
  company?: string | null;
  joined_text?: string | null;
  born_text?: string | null;
  verified?: boolean;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  href: string;
  logo_url: string | null;
  sort_order: number;
  visibility?: Visibility; // missing until 002_content_model.sql has been run
}

export type TechCategory = 'stack' | 'skill';

export interface TechItem {
  id: string;
  label: string;
  icon_key: string;
  category: TechCategory;
  project_slug: string | null;
  sort_order: number;
}

export interface SitePage {
  slug: string;
  title: string;
  body: string;
  show_in_nav: boolean;
  nav_order: number;
  visibility: Visibility;
}

export interface TimelineEvent {
  id: string;
  event_date: string;
  title: string;
  body: string;
  category: string;
  image_url: string | null;
  visibility: Visibility;
}

export interface JournalEntry {
  slug: string;
  title: string;
  body: string;
  entry_date: string;
  mood: string | null;
  tags: string[];
  visibility: Visibility;
}

export const COLLECTION_KINDS = ['books', 'playlists', 'links', 'politics', 'life_works', 'carousel', 'other'] as const;
export type CollectionKind = (typeof COLLECTION_KINDS)[number];

export const COLLECTION_KIND_LABELS: Record<CollectionKind, string> = {
  books: 'Books',
  playlists: 'Playlists',
  links: 'Links',
  politics: 'Politics',
  life_works: "Life's works",
  carousel: 'Gallery (photos and videos)',
  other: 'Other',
};

export interface Collection {
  slug: string;
  title: string;
  kind: CollectionKind;
  description: string;
  show_in_nav: boolean;
  sort_order: number;
  visibility: Visibility;
}

export interface CollectionItem {
  id: string;
  collection_slug: string;
  title: string;
  subtitle: string | null;
  url: string | null;
  image_url: string | null;
  notes: string;
  status: string | null;
  rating: number | null;
  play_url?: string | null; // Play Store listing (after 003)
  sort_order: number;
  visibility: Visibility;
}

// A table that does not exist yet (migration not run) or a network error
// must not take the whole site down: treat it as "nothing here".
async function rows<T>(query: PromiseLike<{ data: T[] | null; error: unknown }>): Promise<T[]> {
  const { data, error } = await query;
  if (error || !data) return [];
  return data;
}

// ---- Original content (profile, projects, tech) ---------------------------

export async function getProfile(): Promise<Profile | null> {
  const { data, error } = await getSupabase().from('profile').select('*').eq('id', 1).single();
  if (error) return null;
  return data;
}

async function allProjects(): Promise<Project[]> {
  return rows<Project>(getSupabase().from('projects').select('*').order('sort_order', { ascending: true }));
}

/** Public site: hides private projects. Works before and after the migration. */
export async function getProjects(): Promise<Project[]> {
  return (await allProjects()).filter((p) => p.visibility !== 'private');
}

/** Admin only. */
export async function getOwnerProjects(): Promise<Project[]> {
  return allProjects();
}

export async function getTechItems(): Promise<TechItem[]> {
  return rows<TechItem>(getSupabase().from('tech_items').select('*').order('sort_order', { ascending: true }));
}

// ---- Pages ------------------------------------------------------------------

export async function getPublicPages(): Promise<SitePage[]> {
  return rows<SitePage>(
    getSupabase().from('pages').select('*').eq('visibility', 'public').order('nav_order', { ascending: true }),
  );
}

export async function getPublicPage(slug: string): Promise<SitePage | null> {
  const { data, error } = await getSupabase().from('pages').select('*').eq('slug', slug).eq('visibility', 'public').maybeSingle();
  return error ? null : data;
}

export async function getOwnerPages(): Promise<SitePage[]> {
  return rows<SitePage>(getSupabase().from('pages').select('*').order('nav_order', { ascending: true }));
}

// ---- Timeline ---------------------------------------------------------------

export async function getPublicTimeline(): Promise<TimelineEvent[]> {
  return rows<TimelineEvent>(
    getSupabase().from('timeline_events').select('*').eq('visibility', 'public').order('event_date', { ascending: true }),
  );
}

export async function getOwnerTimeline(): Promise<TimelineEvent[]> {
  return rows<TimelineEvent>(getSupabase().from('timeline_events').select('*').order('event_date', { ascending: true }));
}

// ---- Journal ----------------------------------------------------------------

export async function getPublicJournal(): Promise<JournalEntry[]> {
  return rows<JournalEntry>(
    getSupabase().from('journal_entries').select('*').eq('visibility', 'public').order('entry_date', { ascending: false }),
  );
}

export async function getPublicJournalEntry(slug: string): Promise<JournalEntry | null> {
  const { data, error } = await getSupabase()
    .from('journal_entries')
    .select('*')
    .eq('slug', slug)
    .eq('visibility', 'public')
    .maybeSingle();
  return error ? null : data;
}

export async function getOwnerJournal(): Promise<JournalEntry[]> {
  return rows<JournalEntry>(getSupabase().from('journal_entries').select('*').order('entry_date', { ascending: false }));
}

// ---- Collections ------------------------------------------------------------

export async function getPublicCollections(): Promise<Collection[]> {
  return rows<Collection>(
    getSupabase().from('collections').select('*').eq('visibility', 'public').order('sort_order', { ascending: true }),
  );
}

export async function getPublicCollection(slug: string): Promise<{ collection: Collection; items: CollectionItem[] } | null> {
  const { data, error } = await getSupabase().from('collections').select('*').eq('slug', slug).eq('visibility', 'public').maybeSingle();
  if (error || !data) return null;
  const items = await rows<CollectionItem>(
    getSupabase()
      .from('collection_items')
      .select('*')
      .eq('collection_slug', slug)
      .eq('visibility', 'public')
      .order('sort_order', { ascending: true }),
  );
  return { collection: data, items };
}

export async function getOwnerCollections(): Promise<Collection[]> {
  return rows<Collection>(getSupabase().from('collections').select('*').order('sort_order', { ascending: true }));
}

export async function getOwnerItems(collectionSlug?: string): Promise<CollectionItem[]> {
  let query = getSupabase().from('collection_items').select('*').order('sort_order', { ascending: true });
  if (collectionSlug) query = query.eq('collection_slug', collectionSlug);
  return rows<CollectionItem>(query);
}

// ---- Special lists on the home page ------------------------------------------------

// Ordinary collections (edited in Admin > Collections) that the site places itself.
export const LISTS = {
  experience: 'experience',
  caseStudies: 'case-studies',
  aiWorkflow: 'ai-workflow',
  whatIDo: 'what-i-do',
  offers: 'work-with-me',
  quotes: 'quotes',
  contact: 'contact',
} as const;

// Never offered as their own reading page on "About me".
const SYSTEM_LISTS: string[] = [...Object.values(LISTS), 'working-on'];

/** Public items of one public list, in order. Missing or private list = nothing. */
export async function getPublicList(slug: string): Promise<CollectionItem[]> {
  const data = await getPublicCollection(slug);
  return data ? data.items : [];
}

// ---- Public navigation --------------------------------------------------------------

export interface NavLink {
  href: string;
  label: string;
  short?: string; // for the narrow phone tabs
}

/** The short menu: work first, the person second. */
export async function getPublicNav(): Promise<NavLink[]> {
  const caseStudies = await getPublicList(LISTS.caseStudies);
  return [
    { href: '/#experience', label: 'Work' },
    ...(caseStudies.length > 0 ? [{ href: '/work', label: 'Case studies', short: 'Cases' }] : []),
    { href: '/cv', label: 'CV' },
    { href: '/about', label: 'About me', short: 'About' },
    { href: '/#contact', label: 'Contact' },
  ];
}

/** Everything personal, listed on "About me". Only things that exist AND are public. */
export async function getPersonalLinks(): Promise<NavLink[]> {
  const [pages, timeline, journal, collections, gallery] = await Promise.all([
    getPublicPages(),
    getPublicTimeline(),
    getPublicJournal(),
    getPublicCollections(),
    getPublicGalleryItems(),
  ]);

  const links: NavLink[] = [];
  if (timeline.length > 0) links.push({ href: '/story', label: 'Story' });
  if (gallery.length > 0) links.push({ href: '/gallery', label: 'Gallery' });
  if (journal.length > 0) links.push({ href: '/journal', label: 'Journal' });
  // Gallery collections are shown together on /gallery, so they get no link of their own.
  for (const col of collections) {
    if (col.show_in_nav && col.kind !== 'carousel' && !SYSTEM_LISTS.includes(col.slug)) {
      links.push({ href: `/c/${col.slug}`, label: col.title });
    }
  }
  for (const p of pages) if (p.show_in_nav) links.push({ href: `/p/${p.slug}`, label: p.title });
  return links;
}

// ---- Owner-only single lookups ------------------------------------------------

export async function getOwnerJournalEntry(slug: string): Promise<JournalEntry | null> {
  const { data, error } = await getSupabase().from('journal_entries').select('*').eq('slug', slug).maybeSingle();
  return error ? null : data;
}

export async function getOwnerPage(slug: string): Promise<SitePage | null> {
  const { data, error } = await getSupabase().from('pages').select('*').eq('slug', slug).maybeSingle();
  return error ? null : data;
}

/** Public book items whose status contains "reading" (e.g. "reading now"). */
export async function getReadingNow(): Promise<CollectionItem[]> {
  const collections = (await getPublicCollections()).filter((c) => c.kind === 'books');
  if (collections.length === 0) return [];
  const items = await rows<CollectionItem>(
    getSupabase()
      .from('collection_items')
      .select('*')
      .in(
        'collection_slug',
        collections.map((c) => c.slug),
      )
      .eq('visibility', 'public')
      .ilike('status', '%reading%')
      .order('sort_order', { ascending: true }),
  );
  return items.slice(0, 3);
}

export async function getLatestPublicJournalEntry(): Promise<JournalEntry | null> {
  return (await getPublicJournal())[0] ?? null;
}

/** Everything public in collections of type "Gallery" (stored as kind `carousel`). */
export async function getPublicGalleryItems(): Promise<CollectionItem[]> {
  const collections = (await getPublicCollections()).filter((c) => c.kind === 'carousel');
  if (collections.length === 0) return [];
  return rows<CollectionItem>(
    getSupabase()
      .from('collection_items')
      .select('*')
      .in(
        'collection_slug',
        collections.map((c) => c.slug),
      )
      .eq('visibility', 'public')
      .order('sort_order', { ascending: true }),
  );
}

// ---- Uploaded files -----------------------------------------------------------

/** True if something public is using this uploaded file right now. Anything unclear = false. */
export async function isPublicMedia(ref: string): Promise<boolean> {
  const db = getSupabase();
  const [avatar, cover, project, event, publicCollections] = await Promise.all([
    rows(db.from('profile').select('id').eq('avatar_url', ref).limit(1)),
    rows(db.from('profile').select('id').eq('cover_url', ref).limit(1)),
    rows<Project>(db.from('projects').select('*').eq('logo_url', ref)),
    rows(db.from('timeline_events').select('id').eq('image_url', ref).eq('visibility', 'public').limit(1)),
    getPublicCollections(),
  ]);
  if (avatar.length || cover.length || event.length || project.some((p) => p.visibility !== 'private')) return true;
  if (publicCollections.length === 0) return false;

  const slugs = publicCollections.map((c) => c.slug);
  const uses = await Promise.all(
    ['image_url', 'url'].map((column) =>
      rows(db.from('collection_items').select('id').eq(column, ref).eq('visibility', 'public').in('collection_slug', slugs).limit(1)),
    ),
  );
  return uses.some((found) => found.length > 0);
}

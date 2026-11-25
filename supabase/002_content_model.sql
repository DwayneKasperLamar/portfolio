-- Run once in the Supabase SQL editor, AFTER schema.sql. Safe to run twice.
-- Adds: visibility (public / private) on everything, plus pages, timeline,
-- journal and collections (books, playlists, links, politics, life's works,
-- carousels). Nothing here changes existing rows.
--
-- PRIVACY MODEL
-- * Every row has `visibility`: 'public' or 'private'.
-- * The site server reads with the service-role key (which ignores RLS), so
--   the code in src/lib/content.ts filters on visibility itself. The RLS
--   policies below are a second lock: if the anon key is ever used by
--   mistake, it can still only read rows marked public.

alter table projects add column if not exists visibility text not null default 'public'
  check (visibility in ('public', 'private'));

-- Tighten the old "read everything" policy on projects so private ones stay hidden from the anon key.
drop policy if exists "public read projects" on projects;
create policy "public read projects" on projects for select using (visibility = 'public');

create table if not exists pages (
  slug text primary key,
  title text not null,
  body text not null default '',
  show_in_nav boolean not null default true,
  nav_order int not null default 0,
  visibility text not null default 'private' check (visibility in ('public', 'private')),
  updated_at timestamptz not null default now()
);

create table if not exists timeline_events (
  id uuid primary key default gen_random_uuid(),
  event_date text not null check (event_date ~ '^\d{4}(-\d{2}(-\d{2})?)?$'), -- 2019, 2019-06 or 2019-06-12
  title text not null,
  body text not null default '',
  category text not null default 'life',  -- life, work, school, travel ... free text
  image_url text,
  visibility text not null default 'private' check (visibility in ('public', 'private')),
  created_at timestamptz not null default now()
);
create index if not exists timeline_events_date_idx on timeline_events (event_date);

create table if not exists journal_entries (
  slug text primary key,
  title text not null,
  body text not null default '',
  entry_date date not null default current_date,
  mood text,
  tags text[] not null default '{}',
  visibility text not null default 'private' check (visibility in ('public', 'private')),
  created_at timestamptz not null default now()
);
create index if not exists journal_entries_date_idx on journal_entries (entry_date desc);

create table if not exists collections (
  slug text primary key,
  title text not null,
  kind text not null default 'links'
    check (kind in ('books', 'playlists', 'links', 'politics', 'life_works', 'carousel', 'other')),
  description text not null default '',
  show_in_nav boolean not null default true,
  sort_order int not null default 0,
  visibility text not null default 'private' check (visibility in ('public', 'private'))
);

create table if not exists collection_items (
  id uuid primary key default gen_random_uuid(),
  collection_slug text not null references collections(slug) on delete cascade,
  title text not null,
  subtitle text,            -- author, artist, source ...
  url text,
  image_url text,
  notes text not null default '',
  status text,              -- read / reading / want to read, or anything you like
  rating int check (rating between 1 and 5),
  sort_order int not null default 0,
  visibility text not null default 'public' check (visibility in ('public', 'private'))
);
create index if not exists collection_items_collection_idx on collection_items (collection_slug, sort_order);

alter table pages enable row level security;
alter table timeline_events enable row level security;
alter table journal_entries enable row level security;
alter table collections enable row level security;
alter table collection_items enable row level security;

drop policy if exists "public read pages" on pages;
drop policy if exists "public read timeline" on timeline_events;
drop policy if exists "public read journal" on journal_entries;
drop policy if exists "public read collections" on collections;
drop policy if exists "public read items" on collection_items;

create policy "public read pages" on pages for select using (visibility = 'public');
create policy "public read timeline" on timeline_events for select using (visibility = 'public');
create policy "public read journal" on journal_entries for select using (visibility = 'public');
create policy "public read collections" on collections for select using (visibility = 'public');
-- An item is public only if it is public AND its collection is public.
create policy "public read items" on collection_items for select using (
  visibility = 'public'
  and exists (select 1 from collections c where c.slug = collection_slug and c.visibility = 'public')
);

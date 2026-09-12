-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).

create table if not exists profile (
  id int primary key default 1,
  name text not null,
  location text not null,
  role_title text not null,
  current_role_text text not null,
  previous_role_text text not null,
  now_text text not null,
  email text not null,
  github_url text not null,
  twitter_url text not null,
  constraint profile_singleton check (id = 1)
);

create table if not exists projects (
  slug text primary key,
  title text not null,
  description text not null,
  href text not null,
  logo_url text,
  sort_order int not null default 0
);

create table if not exists tech_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  icon_key text not null,
  category text not null check (category in ('stack', 'skill')),
  project_slug text references projects(slug) on delete set null,
  sort_order int not null default 0
);

alter table profile enable row level security;
alter table projects enable row level security;
alter table tech_items enable row level security;

-- Public (anon) read access for the site; all writes go through the
-- service-role key from server actions, which bypasses RLS entirely.
create policy "public read profile" on profile for select using (true);
create policy "public read projects" on projects for select using (true);
create policy "public read tech_items" on tech_items for select using (true);

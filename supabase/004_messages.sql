-- Run once in the Supabase SQL editor. Safe to run twice.
-- Messages sent through the site's message box.
--
-- PRIVACY: row level security is on and there are NO policies, so the public (anon) key can
-- neither read nor write this table. Only the site's server can. `sender_hash` is a scrambled
-- version of the visitor's network address, used only to limit how often someone can send.

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 200),
  body text not null check (char_length(body) between 1 and 3000),
  sender_hash text not null default '',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists messages_created_idx on messages (created_at desc);
create index if not exists messages_sender_idx on messages (sender_hash, created_at desc);

alter table messages enable row level security;

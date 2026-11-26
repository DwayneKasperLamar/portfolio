-- Run once in the Supabase SQL editor, after 002_content_model.sql. Safe to run twice.
-- Adds: profile photo, cover and header details; a Play Store link on list items;
-- and the private storage bucket for uploaded photos and videos.

alter table collection_items add column if not exists play_url text;

alter table profile add column if not exists avatar_url text;
alter table profile add column if not exists cover_url text;
alter table profile add column if not exists handle text;
alter table profile add column if not exists bio text;
alter table profile add column if not exists company text;
alter table profile add column if not exists joined_text text;
alter table profile add column if not exists born_text text;           -- leave empty to keep it off the site
alter table profile add column if not exists verified boolean not null default true; -- decorative badge

-- PRIVATE bucket: files are only reachable through /media/<name>, which checks visibility.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', false, 52428800,
  array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime']
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Run once in the Supabase SQL editor, after 004_messages.sql. Safe to run twice.
-- Client enquiries, paid-session bookings and the owner's booking settings.
--
-- PRIVACY: row level security is on and there are NO policies, so the public (anon) key can
-- neither read nor write any of these. Only the site's server can.

create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 200),
  company text not null check (char_length(company) between 1 and 150),
  job_role text not null check (char_length(job_role) between 1 and 100),
  country text not null check (char_length(country) between 1 and 80),
  city text not null check (char_length(city) between 1 and 80),
  need text not null check (char_length(need) between 1 and 60),
  description text not null check (char_length(description) between 100 and 5000),
  budget text not null check (char_length(budget) between 1 and 60),
  start_when text not null check (char_length(start_when) between 1 and 60),
  status text not null default 'new' check (status in ('new', 'accepted', 'declined')),
  -- The secret part of an accepted client's booking link.
  booking_token text unique check (booking_token is null or char_length(booking_token) = 64),
  sender_hash text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists enquiries_created_idx on enquiries (created_at desc);
create index if not exists enquiries_sender_idx on enquiries (sender_hash, created_at desc);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references enquiries(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  hours int not null check (hours between 1 and 8),
  rate_usd numeric(10, 2) not null check (rate_usd > 0),
  total_usd numeric(10, 2) not null check (total_usd > 0),
  status text not null default 'unpaid' check (status in ('unpaid', 'paid', 'cancelled')),
  created_at timestamptz not null default now(),
  check (ends_at > starts_at),
  -- The database itself refuses two live bookings that overlap.
  constraint bookings_no_overlap exclude using gist (tstzrange(starts_at, ends_at) with &&) where (status <> 'cancelled')
);
create index if not exists bookings_starts_idx on bookings (starts_at);
create index if not exists bookings_enquiry_idx on bookings (enquiry_id);

create table if not exists booking_settings (
  id int primary key default 1 check (id = 1),
  rate_usd numeric(10, 2) check (rate_usd is null or rate_usd > 0), -- empty = booking closed
  open_days int[] not null default '{1,2,3,4,5}',                   -- 0 = Sunday
  open_from int not null default 9 check (open_from between 0 and 23),
  open_to int not null default 17 check (open_to between 1 and 24),
  timezone text not null default 'Africa/Lagos',
  max_hours int not null default 3 check (max_hours between 1 and 8),
  notice_hours int not null default 24 check (notice_hours between 0 and 336),
  horizon_days int not null default 21 check (horizon_days between 1 and 90),
  payment_link text,
  payment_note text,
  check (open_to > open_from)
);
insert into booking_settings (id) values (1) on conflict (id) do nothing;

create table if not exists blocked_days (
  day date primary key
);

alter table profile add column if not exists linkedin_url text;

alter table enquiries enable row level security;
alter table bookings enable row level security;
alter table booking_settings enable row level security;
alter table blocked_days enable row level security;

-- Clients pay before they pick a time, and job offers get a free call.
-- Run once in the Supabase SQL editor, after 005. Safe to run twice.

-- Which path an enquiry came through.
alter table enquiries add column if not exists kind text not null default 'consultation';
alter table enquiries drop constraint if exists enquiries_kind_check;
alter table enquiries add constraint enquiries_kind_check check (kind in ('consultation', 'offer'));

-- A booking is either a paid consultation or a free call about a job offer.
alter table bookings add column if not exists kind text not null default 'consultation';
alter table bookings drop constraint if exists bookings_kind_check;
alter table bookings add constraint bookings_kind_check check (kind in ('consultation', 'call'));
alter table bookings drop constraint if exists bookings_status_check;
alter table bookings add constraint bookings_status_check check (status in ('unpaid', 'paid', 'cancelled', 'requested', 'confirmed'));
-- The database itself refuses a free consultation or a call with a price.
alter table bookings drop constraint if exists bookings_rate_usd_check;
alter table bookings drop constraint if exists bookings_total_usd_check;
alter table bookings drop constraint if exists bookings_price_check;
alter table bookings add constraint bookings_price_check check (
  (kind = 'consultation' and rate_usd > 0 and total_usd > 0 and status in ('unpaid', 'paid', 'cancelled'))
  or (kind = 'call' and rate_usd = 0 and total_usd = 0 and status in ('requested', 'confirmed', 'cancelled'))
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references enquiries(id) on delete cascade,
  hours int not null check (hours between 1 and 8),
  rate_usd numeric(10, 2) not null check (rate_usd > 0),
  total_usd numeric(10, 2) not null check (total_usd > 0),
  -- claimed: the client says they paid. confirmed: you saw the money.
  -- rejected: you did not find it. used: a time has been booked with it.
  status text not null default 'claimed' check (status in ('claimed', 'confirmed', 'rejected', 'used')),
  booking_id uuid references bookings(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists payments_enquiry_idx on payments (enquiry_id, created_at desc);
-- Only one payment per client can be waiting for you at a time.
create unique index if not exists payments_one_waiting on payments (enquiry_id) where status = 'claimed';

-- The meeting link put into the email that confirms a call.
alter table booking_settings add column if not exists call_link text;

-- Closed to everyone except the server.
alter table payments enable row level security;

import { getSupabase } from '@/lib/supabase';
import { DEFAULT_SETTINGS, type BookingSettings } from '@/lib/booking';

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  job_role: string;
  country: string;
  city: string;
  need: string;
  description: string;
  budget: string;
  start_when: string;
  status: 'new' | 'accepted' | 'declined';
  booking_token: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  enquiry_id: string;
  starts_at: string;
  ends_at: string;
  hours: number;
  rate_usd: number;
  total_usd: number;
  status: 'unpaid' | 'paid' | 'cancelled';
}

const ENQUIRY_COLUMNS = 'id,name,email,company,job_role,country,city,need,description,budget,start_when,status,booking_token,created_at';
const BOOKING_COLUMNS = 'id,enquiry_id,starts_at,ends_at,hours,rate_usd,total_usd,status';
export const BOOKING_TOKEN = /^[0-9a-f]{64}$/;

/** False until supabase/005_enquiries_bookings.sql has been run. */
export async function enquiriesReady(): Promise<boolean> {
  const { error } = await getSupabase().from('enquiries').select('id').limit(1);
  return !error;
}

// ---- Owner only (behind the login) -------------------------------------------------

export async function getOwnerEnquiries(): Promise<Enquiry[]> {
  const { data, error } = await getSupabase().from('enquiries').select(ENQUIRY_COLUMNS).order('created_at', { ascending: false }).limit(300);
  return error || !data ? [] : data;
}

export async function countNewEnquiries(): Promise<number> {
  const { data, error } = await getSupabase().from('enquiries').select('id').eq('status', 'new').limit(300);
  return error || !data ? 0 : data.length;
}

export async function getOwnerBookings(): Promise<Booking[]> {
  const { data, error } = await getSupabase().from('bookings').select(BOOKING_COLUMNS).order('starts_at', { ascending: true }).limit(1000);
  return error || !data ? [] : data;
}

// ---- Settings and availability ------------------------------------------------------

export async function getBookingSettings(): Promise<BookingSettings> {
  const { data, error } = await getSupabase().from('booking_settings').select('*').eq('id', 1).maybeSingle();
  if (error || !data) return DEFAULT_SETTINGS;
  return { ...data, rate_usd: data.rate_usd === null ? null : Number(data.rate_usd) };
}

export async function getBlockedDays(): Promise<string[]> {
  const { data, error } = await getSupabase().from('blocked_days').select('day').order('day', { ascending: true });
  return error || !data ? [] : data.map((d) => d.day);
}

/** Times already taken (no names, nothing about who). Null if it cannot be read. */
export async function getBusyTimes(): Promise<{ starts_at: string; ends_at: string }[] | null> {
  const { data, error } = await getSupabase()
    .from('bookings')
    .select('starts_at,ends_at')
    .neq('status', 'cancelled')
    .gte('ends_at', new Date().toISOString());
  return error || !data ? null : data;
}

// ---- A client with their secret link --------------------------------------------------

/** The accepted enquiry behind a booking link, or null for anything else. */
export async function getEnquiryByToken(token: string): Promise<Enquiry | null> {
  if (!BOOKING_TOKEN.test(token)) return null;
  const { data, error } = await getSupabase()
    .from('enquiries')
    .select(ENQUIRY_COLUMNS)
    .eq('booking_token', token)
    .eq('status', 'accepted')
    .maybeSingle();
  return error ? null : data;
}

export async function getBookingsFor(enquiryId: string): Promise<Booking[]> {
  const { data, error } = await getSupabase()
    .from('bookings')
    .select(BOOKING_COLUMNS)
    .eq('enquiry_id', enquiryId)
    .neq('status', 'cancelled')
    .order('starts_at', { ascending: true });
  return error || !data ? [] : data;
}

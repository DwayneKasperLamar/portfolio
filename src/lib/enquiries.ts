import { getSupabase } from '@/lib/supabase';
import { DEFAULT_SETTINGS, type BookingSettings } from '@/lib/booking';

export interface Enquiry {
  id: string;
  kind: 'consultation' | 'offer';
  name: string;
  email: string;
  company: string;
  job_role: string;
  country: string;
  city: string;
  need: string;
  description: string;
  budget: string; // for a job offer: the pay range
  start_when: string;
  status: 'new' | 'accepted' | 'declined';
  booking_token: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  enquiry_id: string;
  kind: 'consultation' | 'call';
  starts_at: string;
  ends_at: string;
  hours: number;
  rate_usd: number;
  total_usd: number;
  status: 'unpaid' | 'paid' | 'cancelled' | 'requested' | 'confirmed';
}

export interface Payment {
  id: string;
  enquiry_id: string;
  hours: number;
  rate_usd: number;
  total_usd: number;
  status: 'claimed' | 'confirmed' | 'rejected' | 'used';
  booking_id: string | null;
  created_at: string;
}

export const BOOKING_TOKEN = /^[0-9a-f]{64}$/;

// Rows from before script 006 have no "kind": they were all consultations. The sender's
// scrambled address never leaves this file.
type Row = Record<string, any>;
const toEnquiry = ({ sender_hash: _hidden, ...row }: Row) => ({ ...row, kind: row.kind ?? 'consultation' }) as Enquiry;
const toBooking = (row: Row) => ({ ...row, kind: row.kind ?? 'consultation', rate_usd: Number(row.rate_usd), total_usd: Number(row.total_usd) }) as Booking;
const toPayment = (row: Row) => ({ ...row, rate_usd: Number(row.rate_usd), total_usd: Number(row.total_usd) }) as Payment;

/** False until supabase/005_enquiries_bookings.sql has been run. */
export async function enquiriesReady(): Promise<boolean> {
  const { error } = await getSupabase().from('enquiries').select('id').limit(1);
  return !error;
}

/** False until supabase/006_pay_first_and_offers.sql has been run. */
export async function paymentsReady(): Promise<boolean> {
  const { error } = await getSupabase().from('payments').select('id').limit(1);
  return !error;
}

// ---- Owner only (behind the login) -------------------------------------------------

export async function getOwnerEnquiries(): Promise<Enquiry[]> {
  const { data, error } = await getSupabase().from('enquiries').select('*').order('created_at', { ascending: false }).limit(300);
  return error || !data ? [] : data.map(toEnquiry);
}

export async function getOwnerBookings(): Promise<Booking[]> {
  const { data, error } = await getSupabase().from('bookings').select('*').order('starts_at', { ascending: true }).limit(1000);
  return error || !data ? [] : data.map(toBooking);
}

export async function getOwnerPayments(): Promise<Payment[]> {
  const { data, error } = await getSupabase().from('payments').select('*').order('created_at', { ascending: false }).limit(500);
  return error || !data ? [] : data.map(toPayment);
}

/** How many things need an answer: new enquiries, and payments to check. */
export async function countWaiting(): Promise<number> {
  const db = getSupabase();
  const [fresh, claimed] = await Promise.all([
    db.from('enquiries').select('id').eq('status', 'new').limit(300),
    db.from('payments').select('id').eq('status', 'claimed').limit(300),
  ]);
  return (fresh.data?.length ?? 0) + (claimed.data?.length ?? 0);
}

// ---- Settings and availability ------------------------------------------------------

export async function getBookingSettings(): Promise<BookingSettings> {
  const { data, error } = await getSupabase().from('booking_settings').select('*').eq('id', 1).maybeSingle();
  if (error || !data) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...data, rate_usd: data.rate_usd === null ? null : Number(data.rate_usd) };
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

/** The accepted consultation behind a booking link, or null for anything else. */
export async function getEnquiryByToken(token: string): Promise<Enquiry | null> {
  if (!BOOKING_TOKEN.test(token)) return null;
  const { data, error } = await getSupabase().from('enquiries').select('*').eq('booking_token', token).eq('status', 'accepted').maybeSingle();
  if (error || !data) return null;
  const enquiry = toEnquiry(data);
  return enquiry.kind === 'consultation' ? enquiry : null;
}

export async function getBookingsFor(enquiryId: string): Promise<Booking[]> {
  const { data, error } = await getSupabase()
    .from('bookings')
    .select('*')
    .eq('enquiry_id', enquiryId)
    .neq('status', 'cancelled')
    .order('starts_at', { ascending: true });
  return error || !data ? [] : data.map(toBooking);
}

export async function getPaymentsFor(enquiryId: string): Promise<Payment[]> {
  const { data, error } = await getSupabase().from('payments').select('*').eq('enquiry_id', enquiryId).order('created_at', { ascending: false });
  return error || !data ? [] : data.map(toPayment);
}

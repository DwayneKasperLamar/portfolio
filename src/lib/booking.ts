// Shared rules for enquiries and bookings. No database here, so the browser and the server
// can both use it, and so the time rules can be tested on their own.

export const NEEDS = ['Architecture review', 'First version', 'Payments', 'Something else'] as const;
export const BUDGETS = ['Under $1,000', '$1,000 to $5,000', '$5,000 to $20,000', 'Over $20,000', 'Not sure yet'] as const;
export const STARTS = ['As soon as possible', 'Within a month', 'In 1 to 3 months', 'Later or not sure'] as const;

// Job offers take their own, free path.
export const OFFER_NEED = 'Job offer';
export const NOT_GIVEN = 'Not given';
export const REPLY_HOURS = 24; // the promise shown to recruiters

export const ENQUIRY_LIMITS = {
  name: 100, email: 200, company: 150, job_role: 100, country: 80, city: 80, pay_range: 60,
  descriptionMin: 100, descriptionMax: 5000, perSenderPerHour: 3, everyonePerDay: 50,
  waitingCallsPerSender: 2, waitingCalls: 10, claimsPerDay: 5,
} as const;

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export interface BookingSettings {
  rate_usd: number | null; // null = consultations closed
  open_days: number[];
  open_from: number; // hour of the day in the owner's time zone
  open_to: number;
  timezone: string;
  max_hours: number;
  horizon_days: number;
  payment_link: string | null;
  payment_note: string | null;
  call_link: string | null;
}

export const DEFAULT_SETTINGS: BookingSettings = {
  rate_usd: null, open_days: [1, 2, 3, 4, 5], open_from: 9, open_to: 17, timezone: 'Africa/Lagos',
  max_hours: 3, horizon_days: 21, payment_link: null, payment_note: null, call_link: null,
};

export const usd = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export function validTimeZone(zone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: zone });
    return true;
  } catch {
    return false;
  }
}

/** The calendar date, hour and weekday that a moment has in a time zone. */
export function partsIn(date: Date, zone: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  );
  const key = `${parts.year}-${parts.month}-${parts.day}`;
  return { key, hour: Number(parts.hour), minute: Number(parts.minute), weekday: new Date(`${key}T00:00:00Z`).getUTCDay() };
}

/** "2027-01-05" + 9 o'clock in a zone -> the actual moment (handles daylight saving). */
export function zonedToUtc(key: string, hour: number, zone: string): Date {
  const wanted = Date.parse(`${key}T00:00:00Z`) + hour * 3_600_000;
  let guess = wanted;
  for (let i = 0; i < 2; i++) {
    const p = partsIn(new Date(guess), zone);
    const shown = Date.parse(`${p.key}T00:00:00Z`) + p.hour * 3_600_000 + p.minute * 60_000;
    guess += wanted - shown;
  }
  return new Date(guess);
}

export const addDays = (key: string, days: number) =>
  new Date(Date.parse(`${key}T12:00:00Z`) + days * 86_400_000).toISOString().slice(0, 10);

/** Midnight at the start of the next day, in the owner's time zone. Nothing can be booked before it. */
export const nextDayStart = (zone: string, now: Date = new Date()) => zonedToUtc(addDays(partsIn(now, zone).key, 1), 0, zone);

export interface Slot {
  start: string; // ISO moment
  maxHours: number;
}

/**
 * Every hour someone may start a session or call, from the next day on, and how long it may run.
 * The pages show this list and the server checks a request against the same list, so the two
 * can never disagree. Whether a price is needed is the caller's business.
 */
export function openSlots(
  settings: BookingSettings,
  busy: { starts_at: string; ends_at: string }[],
  blocked: string[],
  now: Date = new Date(),
): Slot[] {
  if (!validTimeZone(settings.timezone)) return [];
  const taken = busy.map((b) => [Date.parse(b.starts_at), Date.parse(b.ends_at)] as const);
  const today = partsIn(now, settings.timezone).key;
  const slots: Slot[] = [];

  for (let offset = 1; offset <= settings.horizon_days; offset++) {
    const day = addDays(today, offset);
    if (blocked.includes(day) || !settings.open_days.includes(new Date(`${day}T00:00:00Z`).getUTCDay())) continue;
    for (let hour = settings.open_from; hour < settings.open_to; hour++) {
      const start = zonedToUtc(day, hour, settings.timezone).getTime();
      let maxHours = 0;
      for (let length = 1; length <= settings.max_hours && hour + length <= settings.open_to; length++) {
        const end = start + length * 3_600_000;
        if (taken.some(([from, to]) => start < to && end > from)) break;
        maxHours = length;
      }
      if (maxHours > 0) slots.push({ start: new Date(start).toISOString(), maxHours });
    }
  }
  return slots;
}

/** How long is left of the reply promise for a job offer, in plain words. */
export function replyNote(sentAt: string, now: Date = new Date()): string {
  const hours = (Date.parse(sentAt) + REPLY_HOURS * 3_600_000 - now.getTime()) / 3_600_000;
  if (hours <= 0) return `Reply is late by ${Math.max(1, Math.floor(-hours))} h`;
  return `Reply within ${Math.ceil(hours)} h`;
}

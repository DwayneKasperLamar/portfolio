import Link from 'next/link';
import ConfirmButton from '../_ConfirmButton';
import { blockDay, saveHours, savePrice, setBookingStatus, unblockDay } from './actions';
import { ExplainNote, PageHead, btnClass, btnFillClass, cardClass, deleteClass, fieldClass, labelClass, smallClass } from '../_ui';
import { ownerClock } from '../_format';
import { MAX_NOTICE_HOURS, WEEKDAYS, addDays, partsIn, usd } from '@/lib/booking';
import { enquiriesReady, getBlockedDays, getBookingSettings, getOwnerBookings, getOwnerEnquiries } from '@/lib/enquiries';
import { requireOwner } from '@/lib/owner';

export const dynamic = 'force-dynamic';

const PROBLEMS: Record<string, string> = {
  days: 'Choose at least one open day.',
  hours: 'Closing time must be after opening time.',
  range: `Notice must be 0 to ${MAX_NOTICE_HOURS} hours (14 days), and booking ahead 1 to 90 days.`,
  zone: 'That time zone is not recognised. Use a form like Africa/Lagos or Europe/London.',
  rate: 'The rate must be above 0 and at most 10,000 dollars. Leave it empty to close booking.',
  length: 'The longest session must be 1 to 8 hours.',
  day: 'Choose today or a later date.',
};
const SAVED: Record<string, string> = { hours: 'Opening hours saved.', price: 'Price saved.', blocked: 'Day blocked.' };

const dayName = (key: string) =>
  new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${key}T12:00:00Z`));
const clockLabel = (hour: number) => `${String(hour).padStart(2, '0')}:00`;

export default async function AdminBookingsPage({ searchParams }: { searchParams: { week?: string; problem?: string; saved?: string } }) {
  await requireOwner('/admin/bookings');
  const [ready, bookings, enquiries, settings, blocked] = await Promise.all([
    enquiriesReady(), getOwnerBookings(), getOwnerEnquiries(), getBookingSettings(), getBlockedDays(),
  ]);

  const week = Math.max(-52, Math.min(52, Math.trunc(Number(searchParams.week) || 0)));
  const today = partsIn(new Date(), settings.timezone);
  const first = addDays(today.key, week * 7); // seven days at a time, starting today
  const who = new Map(enquiries.map((e) => [e.id, e]));
  const live = bookings.filter((b) => b.status !== 'cancelled');
  const days = Array.from({ length: 7 }, (_, i) => addDays(first, i))
    .map((key) => ({
      key,
      weekday: new Date(`${key}T00:00:00Z`).getUTCDay(),
      blocked: blocked.includes(key),
      sessions: live.filter((b) => partsIn(new Date(b.starts_at), settings.timezone).key === key),
    }))
    .filter((d) => settings.open_days.includes(d.weekday) || d.sessions.length > 0 || d.blocked);
  const comingBlocked = blocked.filter((d) => d >= today.key);

  const problem = searchParams.problem ? PROBLEMS[searchParams.problem] : null;
  const saved = searchParams.saved ? SAVED[searchParams.saved] : null;

  const statusForm = (id: string, status: 'paid' | 'unpaid', label: string) => (
    <form action={setBookingStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button type="submit" className={smallClass}>{label}</button>
    </form>
  );
  const numberField = (name: string, label: string, value: number | string, extra: React.InputHTMLAttributes<HTMLInputElement>) => (
    <label>
      <span className={labelClass}>{label}</span>
      <input type="number" name={name} defaultValue={value} className={fieldClass} {...extra} />
    </label>
  );

  return (
    <div>
      <PageHead title="Bookings">
        <a href="#block" className={btnClass}>Block a day</a>
        <a href="#hours" className={btnFillClass}>Opening hours</a>
      </PageHead>
      <ExplainNote>
        Paid sessions with clients you accepted. A session is unpaid until you mark it paid, after you see the money. Times are in{' '}
        {settings.timezone}.
      </ExplainNote>

      {!ready && (
        <p className="mb-4 rounded-xl border border-line bg-surface-alt p-4">
          <b>Not set up yet:</b> run <code>supabase/005_enquiries_bookings.sql</code> in the Supabase SQL editor.
        </p>
      )}
      {problem && <p role="alert" className="mb-4 rounded-xl border border-primary bg-surface-alt p-3 font-medium">{problem}</p>}
      {saved && <p role="status" className="mb-4 rounded-xl border border-line bg-surface-alt p-3">{saved}</p>}

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 className="mr-auto font-semibold text-primary">
          {dayName(first)} to {dayName(addDays(first, 6))}
        </h2>
        <Link href={`/admin/bookings?week=${week - 1}`} className={smallClass}>&larr; Earlier</Link>
        {week !== 0 && <Link href="/admin/bookings" className={smallClass}>Today</Link>}
        <Link href={`/admin/bookings?week=${week + 1}`} className={smallClass}>Later &rarr;</Link>
      </div>

      <ul className="grid gap-2.5 [grid-template-columns:repeat(auto-fill,minmax(158px,1fr))]">
        {days.map((d) => (
          <li key={d.key} className={`flex min-h-[150px] flex-col gap-2 rounded-xl border bg-surface p-2.5 ${d.key === today.key ? 'border-primary' : 'border-line'}`}>
            <h3 className="text-[13px] font-semibold text-primary">{dayName(d.key)}</h3>
            {d.blocked && (
              <form action={unblockDay} className="flex items-center justify-between gap-2 text-xs text-muted">
                <input type="hidden" name="day" value={d.key} />
                Blocked
                <button type="submit" className={deleteClass}>Open again</button>
              </form>
            )}
            {d.sessions.map((b) => {
              const client = who.get(b.enquiry_id)?.name ?? 'Client';
              return (
                <div key={b.id} className={`grid gap-1 rounded-[9px] border bg-surface-alt p-2 text-xs ${b.status === 'paid' ? 'border-line' : 'border-dashed border-muted'}`}>
                  <b className="text-primary">
                    {ownerClock(b.starts_at, settings.timezone)}–{ownerClock(b.ends_at, settings.timezone)}
                  </b>
                  <Link href={`/admin/enquiries?id=${b.enquiry_id}`} className="truncate underline decoration-line">{client}</Link>
                  <span className="flex items-center gap-1.5 text-muted">
                    {b.status === 'paid' && <span className="status-dot" />}
                    {usd(Number(b.total_usd))} · {b.status === 'paid' ? 'Paid' : 'Waiting for payment'}
                  </span>
                  <span className="mt-1 flex flex-wrap items-center gap-2">
                    {b.status === 'paid' ? statusForm(b.id, 'unpaid', 'Not paid') : statusForm(b.id, 'paid', 'Mark paid')}
                    <form action={setBookingStatus}>
                      <input type="hidden" name="id" value={b.id} />
                      <input type="hidden" name="status" value="cancelled" />
                      <ConfirmButton question={`Cancel the session with ${client}? Tell them yourself, and refund them if they paid.`} className={deleteClass}>
                        Cancel
                      </ConfirmButton>
                    </form>
                  </span>
                </div>
              );
            })}
            {!d.blocked && d.sessions.length === 0 && <p className="text-xs text-muted">Free</p>}
          </li>
        ))}
      </ul>

      <div className="mt-5 grid items-start gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <form id="hours" action={saveHours} className={`${cardClass} scroll-mt-20`}>
          <h2 className="font-semibold text-primary">When people can book</h2>
          <fieldset>
            <legend className={labelClass}>Open days</legend>
            <div className="flex flex-wrap gap-1.5">
              {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                <label key={d} className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[13px]">
                  <input type="checkbox" name="open_days" value={d} defaultChecked={settings.open_days.includes(d)} />
                  {WEEKDAYS[d]}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                ['open_from', 'From', 0, 23, settings.open_from],
                ['open_to', 'Until', 1, 24, settings.open_to],
              ] as const
            ).map(([name, label, min, max, value]) => (
              <label key={name}>
                <span className={labelClass}>{label}</span>
                <select name={name} defaultValue={value} className={fieldClass}>
                  {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((h) => (
                    <option key={h} value={h}>{clockLabel(h)}</option>
                  ))}
                </select>
              </label>
            ))}
            {numberField('notice_hours', 'Notice needed (hours)', settings.notice_hours, { min: 0, max: MAX_NOTICE_HOURS, required: true })}
            {numberField('horizon_days', 'Book ahead (days)', settings.horizon_days, { min: 1, max: 90, required: true })}
          </div>
          <label>
            <span className={labelClass}>Your time zone</span>
            <input name="timezone" defaultValue={settings.timezone} required maxLength={60} className={fieldClass} />
          </label>
          <button type="submit" disabled={!ready} className={`${btnFillClass} self-start`}>Save hours</button>
        </form>

        <form id="price" action={savePrice} className={`${cardClass} scroll-mt-20`}>
          <h2 className="font-semibold text-primary">Price</h2>
          {numberField('rate_usd', 'Rate per hour (US dollars)', settings.rate_usd ?? '', { min: 1, max: 10000, step: '0.01', placeholder: 'Empty = closed' })}
          {numberField('max_hours', 'Longest session (hours)', settings.max_hours, { min: 1, max: 8, required: true })}
          <p className="text-[13px] text-muted">
            {settings.rate_usd ? `Clients see ${usd(settings.rate_usd)} per hour.` : 'Booking is closed until you set a rate.'} A new rate does not change
            sessions already booked. How they pay is set in <Link href="/admin/settings" className="underline">Settings</Link>.
          </p>
          <button type="submit" disabled={!ready} className={`${btnFillClass} self-start`}>Save price</button>
        </form>

        <div id="block" className={`${cardClass} scroll-mt-20`}>
          <h2 className="font-semibold text-primary">Block a day</h2>
          <form action={blockDay} className="flex flex-wrap items-end gap-2">
            <label className="flex-1">
              <span className={labelClass}>Date</span>
              <input type="date" name="day" min={today.key} required className={fieldClass} />
            </label>
            <button type="submit" disabled={!ready} className={btnClass}>Block</button>
          </form>
          <p className="text-[13px] text-muted">Nobody can book a blocked day. Sessions already booked on it stay: cancel them above if needed.</p>
          {comingBlocked.length > 0 && (
            <ul>
              {comingBlocked.map((day) => (
                <li key={day} className="flex items-center justify-between border-t border-line py-2">
                  {dayName(day)}
                  <form action={unblockDay}>
                    <input type="hidden" name="day" value={day} />
                    <button type="submit" className={deleteClass}>Open again</button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

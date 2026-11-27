import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BookingPicker from '@/components/BookingPicker';
import PayCard from '@/components/PayCard';
import LocalTime from '@/components/LocalTime';
import ThemeIconButton from '@/components/ThemeIconButton';
import { changeTime } from '../../actions/booking';
import { nextDayStart, openSlots, usd } from '@/lib/booking';
import {
  getBlockedDays, getBookingSettings, getBookingsFor, getBusyTimes, getEnquiryByToken, getPaymentsFor, paymentsReady,
} from '@/lib/enquiries';
import { safeUrl } from '@/lib/safe-url';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Book a session', robots: { index: false, follow: false } };

const hoursText = (n: number) => `${n} ${n === 1 ? 'hour' : 'hours'}`;

// Reached only through the secret link sent to an accepted client.
// Pay, wait for the payment to be confirmed, then pick a time.
export default async function BookPage({ params }: { params: { token: string } }) {
  const enquiry = await getEnquiryByToken(params.token);
  if (!enquiry) notFound();
  const [ready, settings, blocked, busy, sessions, payments] = await Promise.all([
    paymentsReady(), getBookingSettings(), getBlockedDays(), getBusyTimes(), getBookingsFor(enquiry.id), getPaymentsFor(enquiry.id),
  ]);

  const upcoming = sessions.filter((b) => b.kind === 'consultation' && Date.parse(b.ends_at) > Date.now());
  const waiting = payments.find((p) => p.status === 'claimed');
  const usable = payments.find((p) => p.status === 'confirmed');
  const notFoundYet = !waiting && payments[0]?.status === 'rejected';
  const changeFrom = nextDayStart(settings.timezone).getTime();
  const slots =
    usable && busy
      ? openSlots({ ...settings, max_hours: Math.max(settings.max_hours, usable.hours) }, busy, blocked).filter((s) => s.maxHours >= usable.hours)
      : [];
  const title = usable ? 'Pick your time' : waiting ? 'Checking your payment' : upcoming.length ? 'Your booking' : 'Pay for your session';

  return (
    <main className="mx-auto max-w-[640px] px-5 pb-16 pt-10 text-[15px]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <span className="pill">
          <span className="status-dot" />
          {usable ? `Payment received · ${hoursText(usable.hours)}` : 'Your enquiry was accepted'}
        </span>
        <ThemeIconButton />
      </div>
      <h1 className="text-[30px] font-semibold leading-tight text-primary">{title}</h1>
      <p className="mb-6 mt-1 text-muted">
        Hello {enquiry.name.split(' ')[0]}. {usable ? 'Pick a time from the next day on.' : 'Pay first, then pick a time from the next day on.'}
      </p>

      <div className="grid gap-6">
        {upcoming.length > 0 && (
          <section>
            <h2 className="label mb-3">Your sessions</h2>
            <ul className="grid gap-3">
              {upcoming.map((b) => (
                <li key={b.id} className="rounded-xl border border-line bg-surface p-4">
                  <p className="font-semibold text-primary">
                    <LocalTime iso={b.starts_at} /> · {hoursText(b.hours)}
                  </p>
                  <p className="text-secondary">{usd(b.total_usd)}{b.status === 'paid' && ' · Paid. See you then.'}</p>
                  {b.status === 'paid' && Date.parse(b.starts_at) >= changeFrom && (
                    <form action={changeTime} className="mt-2">
                      <input type="hidden" name="token" value={params.token} />
                      <input type="hidden" name="id" value={b.id} />
                      <button type="submit" className="text-sm text-muted underline">Cancel and pick another time</button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {usable && <BookingPicker key={usable.id} token={params.token} paymentId={usable.id} hours={usable.hours} slots={slots} />}

        {waiting && (
          <section role="status" className="grid gap-2 rounded-xl border border-dashed border-muted bg-surface p-4">
            <p className="font-semibold text-primary">
              {hoursText(waiting.hours)} · {usd(waiting.total_usd)} · waiting for confirmation
            </p>
            <p className="text-sm text-secondary">I check that the money arrived. Then this same page lets you pick your time.</p>
            <a href={`/book/${params.token}`} className="text-sm underline">Check again</a>
          </section>
        )}

        {notFoundYet && (
          <p role="status" className="rounded-xl border border-primary bg-surface-alt p-4 text-sm">
            I have not found your last payment yet. Please check it went through, then press &ldquo;I have paid&rdquo; again, or email me.
          </p>
        )}

        {!usable && !waiting &&
          (ready && settings.rate_usd ? (
            <section>
              {upcoming.length > 0 && <h2 className="label mb-3">Book another session</h2>}
              <PayCard token={params.token} rate={settings.rate_usd} maxHours={settings.max_hours} link={safeUrl(settings.payment_link)} note={settings.payment_note} />
            </section>
          ) : (
            <p className="rounded-xl border border-dashed border-line p-4 text-muted">Booking opens soon. I will email you.</p>
          ))}
      </div>
      <p className="mt-4 text-xs text-muted">Keep this link to yourself: anyone who has it can book in your name.</p>
    </main>
  );
}

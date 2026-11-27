import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BookingPicker from '@/components/BookingPicker';
import LocalTime from '@/components/LocalTime';
import ThemeIconButton from '@/components/ThemeIconButton';
import { cancelBooking } from '../../actions/booking';
import { openSlots, usd } from '@/lib/booking';
import { getBlockedDays, getBookingSettings, getBookingsFor, getBusyTimes, getEnquiryByToken } from '@/lib/enquiries';
import { safeUrl } from '@/lib/safe-url';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Book a session', robots: { index: false, follow: false } };

// Reached only through the secret link sent to an accepted client.
export default async function BookPage({ params }: { params: { token: string } }) {
  const enquiry = await getEnquiryByToken(params.token);
  if (!enquiry) notFound();
  const [settings, blocked, busy, mine] = await Promise.all([getBookingSettings(), getBlockedDays(), getBusyTimes(), getBookingsFor(enquiry.id)]);
  const slots = busy ? openSlots(settings, busy, blocked) : [];
  const upcoming = mine.filter((b) => Date.parse(b.ends_at) > Date.now());
  const payLink = safeUrl(settings.payment_link);

  return (
    <main className="mx-auto max-w-[640px] px-5 pb-16 pt-10 text-[15px]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <span className="pill">
          <span className="status-dot" />
          Your enquiry was accepted
        </span>
        <ThemeIconButton />
      </div>
      <h1 className="text-[30px] font-semibold leading-tight text-primary">Book a session</h1>
      <p className="mb-6 mt-1 text-muted">Hello {enquiry.name.split(' ')[0]}. Sessions are paid in US dollars.</p>

      {upcoming.length > 0 && (
        <section className="mb-6">
          <h2 className="label mb-3">Your sessions</h2>
          <ul className="grid gap-3">
            {upcoming.map((b) => (
              <li key={b.id} className="rounded-xl border border-line bg-surface p-4">
                <p className="font-semibold text-primary">
                  <LocalTime iso={b.starts_at} /> · {b.hours} {b.hours === 1 ? 'hour' : 'hours'}
                </p>
                <p className="text-secondary">
                  {usd(Number(b.total_usd))} · {b.status === 'paid' ? 'Paid. See you then.' : 'Waiting for payment'}
                </p>
                {b.status === 'unpaid' && Date.parse(b.starts_at) > Date.now() && (
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    {payLink ? (
                      <a href={payLink} target="_blank" rel="noreferrer" className="btn btn-fill">
                        Pay {usd(Number(b.total_usd))}
                      </a>
                    ) : (
                      <span className="text-sm text-muted">I will email you how to pay.</span>
                    )}
                    <form action={cancelBooking}>
                      <input type="hidden" name="token" value={params.token} />
                      <input type="hidden" name="id" value={b.id} />
                      <button type="submit" className="text-sm text-muted underline">Cancel this session</button>
                    </form>
                  </div>
                )}
              </li>
            ))}
          </ul>
          {settings.payment_note && <p className="mt-3 whitespace-pre-line text-sm text-secondary">{settings.payment_note}</p>}
        </section>
      )}

      {settings.rate_usd ? (
        <BookingPicker token={params.token} slots={slots} rate={settings.rate_usd} />
      ) : (
        <p className="rounded-xl border border-dashed border-line p-4 text-muted">Booking opens soon. I will email you.</p>
      )}
      <p className="mt-4 text-xs text-muted">Keep this link to yourself: anyone who has it can book in your name.</p>
    </main>
  );
}

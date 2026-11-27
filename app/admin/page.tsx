import Link from 'next/link';
import { ExplainNote, PageHead, btnClass, btnFillClass, cardClass, smallClass } from './_ui';
import { ownerClock, ownerDay } from './_format';
import { partsIn, usd } from '@/lib/booking';
import { getOwnerCollections, getOwnerItems, LISTS } from '@/lib/content';
import { enquiriesReady, getBookingSettings, getOwnerBookings, getOwnerEnquiries } from '@/lib/enquiries';
import { alertsConfigured, getOwnerMessages } from '@/lib/messages';
import { requireOwner } from '@/lib/owner';

export const dynamic = 'force-dynamic';

function Stat({ href, title, big, small }: { href: string; title: string; big: string | number; small: string }) {
  return (
    <Link href={href} className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-muted">
      <span className="label">{title}</span>
      <span className="font-head text-3xl font-semibold leading-tight text-primary">{big}</span>
      <span className="text-[13px] text-muted">{small}</span>
    </Link>
  );
}

export default async function AdminHome() {
  await requireOwner();
  const [ready, enquiries, bookings, settings, messages, collections, items] = await Promise.all([
    enquiriesReady(), getOwnerEnquiries(), getOwnerBookings(), getBookingSettings(), getOwnerMessages(), getOwnerCollections(), getOwnerItems(),
  ]);

  const now = Date.now();
  const hour = partsIn(new Date(), settings.timezone).hour;
  const waiting = enquiries.filter((e) => e.status === 'new');
  const unread = messages.filter((m) => !m.is_read).length;
  const upcoming = bookings.filter((b) => b.status !== 'cancelled' && Date.parse(b.ends_at) > now);
  const thisWeek = upcoming.filter((b) => Date.parse(b.starts_at) < now + 7 * 86_400_000);
  const unpaid = thisWeek.filter((b) => b.status === 'unpaid').length;
  const who = new Map(enquiries.map((e) => [e.id, e]));

  const gallerySlugs = collections.filter((c) => c.kind === 'carousel').map((c) => c.slug);
  const gallery = items.filter((i) => gallerySlugs.includes(i.collection_slug));
  const cases = items.filter((i) => i.collection_slug === LISTS.caseStudies);
  const split = (list: { visibility: string }[]) => {
    const open = list.filter((x) => x.visibility === 'public').length;
    return `${open} public · ${list.length - open} private`;
  };

  const setup = [
    !ready && { text: 'Run supabase/005_enquiries_bookings.sql in the Supabase SQL editor. Until then the enquiry form stays hidden.', href: null },
    ready && !settings.rate_usd && { text: 'Set your hourly rate. Booking stays closed until you do.', href: '/admin/bookings#price' },
    ready && !settings.payment_link && !settings.payment_note && { text: 'Say how clients pay you.', href: '/admin/settings' },
    !alertsConfigured() && { text: 'Switch on email alerts, so you hear about new enquiries.', href: '/admin/settings' },
  ].filter((s): s is { text: string; href: string | null } => Boolean(s));

  return (
    <div>
      <PageHead title={hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'}>
        <Link href="/admin/gallery" className={btnClass}>Add photos</Link>
        <Link href="/admin/journal" className={btnFillClass}>Write an entry</Link>
      </PageHead>
      <ExplainNote>What needs you comes first: people waiting for an answer, then your next calls.</ExplainNote>

      {setup.length > 0 && (
        <div className="mb-4 rounded-xl border border-line bg-surface-alt p-4">
          <b className="text-primary">To finish setting up</b>
          <ul className="mt-1.5 grid list-disc gap-1 pl-5 text-secondary">
            {setup.map((s) => (
              <li key={s.text}>
                {s.href ? <Link href={s.href} className="underline decoration-line hover:decoration-primary">{s.text}</Link> : s.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <Stat href="/admin/enquiries?show=new" title="New enquiries" big={ready ? waiting.length : '—'} small={ready ? `${enquiries.length} in all` : 'not set up yet'} />
        <Stat href="/admin/bookings" title="Calls this week" big={ready ? thisWeek.length : '—'} small={unpaid ? `${unpaid} waiting for payment` : 'next 7 days'} />
        <Stat href="/admin/gallery" title="Gallery" big={gallery.length} small={gallery.length ? split(gallery) : 'add your first photos'} />
        <Stat href={`/admin/collections/${LISTS.caseStudies}`} title="Case studies" big={cases.length} small={split(cases)} />
      </div>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[1.5fr_1fr]">
        <section className={cardClass}>
          <h2 className="font-semibold text-primary">Waiting for you</h2>
          {waiting.length === 0 && unread === 0 ? (
            <p className="text-muted">Nothing is waiting.</p>
          ) : (
            <ul>
              {waiting.slice(0, 6).map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 border-t border-line py-2.5 first:border-t-0">
                  <span className="min-w-0">
                    <b className="block truncate text-primary">{e.name}</b>
                    <span className="block truncate text-[13px] text-muted">
                      {e.need} · {e.city}, {e.country} · {ownerDay(e.created_at, settings.timezone)}
                    </span>
                  </span>
                  <Link href={`/admin/enquiries?id=${e.id}`} className={smallClass}>Read</Link>
                </li>
              ))}
              {unread > 0 && (
                <li className="flex items-center justify-between gap-3 border-t border-line py-2.5 first:border-t-0">
                  <span className="text-secondary">{unread} unread {unread === 1 ? 'message' : 'messages'} from the old message box</span>
                  <Link href="/admin/enquiries#earlier" className={smallClass}>Read</Link>
                </li>
              )}
            </ul>
          )}
        </section>

        <section className={cardClass}>
          <h2 className="font-semibold text-primary">Next calls</h2>
          {upcoming.length === 0 ? (
            <p className="text-muted">No calls booked.</p>
          ) : (
            <ul>
              {upcoming.slice(0, 6).map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3 border-t border-line py-2.5 first:border-t-0">
                  <span className="min-w-0">
                    <b className="block truncate text-primary">{who.get(b.enquiry_id)?.name ?? 'Client'}</b>
                    <span className="block text-[13px] text-muted">
                      {ownerDay(b.starts_at, settings.timezone)}, {ownerClock(b.starts_at, settings.timezone)} · {b.hours} h · {usd(Number(b.total_usd))}
                    </span>
                  </span>
                  <span className={b.status === 'paid' ? 'pill' : 'pill border-dashed !text-muted'}>
                    {b.status === 'paid' && <span className="status-dot" />}
                    {b.status === 'paid' ? 'Paid' : 'Unpaid'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

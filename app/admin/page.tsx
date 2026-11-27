import Link from 'next/link';
import { ExplainNote, PageHead, btnClass, btnFillClass, cardClass, smallClass } from './_ui';
import { ownerClock, ownerDay } from './_format';
import { partsIn, replyNote, usd } from '@/lib/booking';
import { getOwnerCollections, getOwnerItems, LISTS } from '@/lib/content';
import { enquiriesReady, getBookingSettings, getOwnerBookings, getOwnerEnquiries, getOwnerPayments, paymentsReady } from '@/lib/enquiries';
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
  const [ready, twoPaths, enquiries, bookings, payments, settings, messages, collections, items] = await Promise.all([
    enquiriesReady(), paymentsReady(), getOwnerEnquiries(), getOwnerBookings(), getOwnerPayments(), getBookingSettings(), getOwnerMessages(),
    getOwnerCollections(), getOwnerItems(),
  ]);

  const now = Date.now();
  const hour = partsIn(new Date(), settings.timezone).hour;
  const waiting = enquiries.filter((e) => e.status === 'new');
  const unread = messages.filter((m) => !m.is_read).length;
  const upcoming = bookings.filter((b) => b.status !== 'cancelled' && Date.parse(b.ends_at) > now);
  const thisWeek = upcoming.filter((b) => Date.parse(b.starts_at) < now + 7 * 86_400_000);
  const toConfirm = thisWeek.filter((b) => b.status === 'requested').length;
  const claimed = payments.filter((p) => p.status === 'claimed');
  const who = new Map(enquiries.map((e) => [e.id, e]));
  // What needs an answer, most urgent first: job offers, payments to check, then new enquiries.
  const row = (e: (typeof waiting)[number]) => ({ id: e.id, name: e.name, small: `${e.need} · ${e.city}, ${e.country}` });
  const queue = [
    ...waiting.filter((e) => e.kind === 'offer').map((e) => ({ ...row(e), small: `Job offer · ${replyNote(e.created_at)} · ${e.company}` })),
    ...claimed.map((p) => ({ id: p.enquiry_id, name: who.get(p.enquiry_id)?.name ?? 'Client', small: `Says they paid ${usd(p.total_usd)}: check your account` })),
    ...waiting.filter((e) => e.kind !== 'offer').map(row),
  ];

  const gallerySlugs = collections.filter((c) => c.kind === 'carousel').map((c) => c.slug);
  const gallery = items.filter((i) => gallerySlugs.includes(i.collection_slug));
  const cases = items.filter((i) => i.collection_slug === LISTS.caseStudies);
  const split = (list: { visibility: string }[]) => {
    const open = list.filter((x) => x.visibility === 'public').length;
    return `${open} public · ${list.length - open} private`;
  };

  const setup = [
    !ready && { text: 'Run supabase/005_enquiries_bookings.sql in the Supabase SQL editor. Until then the enquiry form stays hidden.', href: null },
    ready && !twoPaths && { text: 'Run supabase/006_pay_first_and_offers.sql in the Supabase SQL editor, so clients can pay and recruiters can pick a time.', href: null },
    ready && !settings.rate_usd && { text: 'Set your hourly rate. Paid bookings stay closed until you do.', href: '/admin/bookings#price' },
    twoPaths && !settings.call_link && { text: 'Save your meeting link, for the calls you confirm.', href: '/admin/settings' },
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
        <Stat href="/admin/bookings" title="Calls this week" big={ready ? thisWeek.length : '—'} small={toConfirm ? `${toConfirm} to confirm` : 'next 7 days'} />
        <Stat href="/admin/gallery" title="Gallery" big={gallery.length} small={gallery.length ? split(gallery) : 'add your first photos'} />
        <Stat href={`/admin/collections/${LISTS.caseStudies}`} title="Case studies" big={cases.length} small={split(cases)} />
      </div>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[1.5fr_1fr]">
        <section className={cardClass}>
          <h2 className="font-semibold text-primary">Waiting for you</h2>
          {queue.length === 0 && unread === 0 ? (
            <p className="text-muted">Nothing is waiting.</p>
          ) : (
            <ul>
              {queue.slice(0, 8).map((q) => (
                <li key={`${q.id}-${q.small}`} className="flex items-center justify-between gap-3 border-t border-line py-2.5 first:border-t-0">
                  <span className="min-w-0">
                    <b className="block truncate text-primary">{q.name}</b>
                    <span className="block truncate text-[13px] text-muted">{q.small}</span>
                  </span>
                  <Link href={`/admin/enquiries?id=${q.id}`} className={smallClass}>Open</Link>
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
                      {ownerDay(b.starts_at, settings.timezone)}, {ownerClock(b.starts_at, settings.timezone)} · {b.hours} h
                      {b.kind === 'consultation' && ` · ${usd(b.total_usd)}`}
                    </span>
                  </span>
                  <span className={b.status === 'paid' || b.status === 'confirmed' ? 'pill' : 'pill border-dashed !text-muted'}>
                    {(b.status === 'paid' || b.status === 'confirmed') && <span className="status-dot" />}
                    {b.status === 'paid' ? 'Paid' : b.status === 'confirmed' ? 'Free call' : b.status === 'requested' ? 'To confirm' : 'Unpaid'}
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

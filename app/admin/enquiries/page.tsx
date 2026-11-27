import Link from 'next/link';
import { headers } from 'next/headers';
import ConfirmButton from '../_ConfirmButton';
import CopyButton from '../_CopyButton';
import { deleteMessage, setMessageRead } from '../messages/actions';
import { acceptEnquiry, declineEnquiry, deleteEnquiry, reopenEnquiry } from './actions';
import { ExplainNote, PageHead, btnClass, btnFillClass, cardClass, deleteClass, smallClass } from '../_ui';
import { mailDraft, ownerClock, ownerDate, ownerDay } from '../_format';
import { usd } from '@/lib/booking';
import { getProfile } from '@/lib/content';
import { enquiriesReady, getBookingSettings, getOwnerBookings, getOwnerEnquiries, type Enquiry } from '@/lib/enquiries';
import { getOwnerMessages } from '@/lib/messages';
import { requireOwner } from '@/lib/owner';

export const dynamic = 'force-dynamic';

const STATUS = { new: 'New', accepted: 'Accepted', declined: 'Declined' } as const;

function StatusTag({ status }: { status: Enquiry['status'] }) {
  return (
    <span className={status === 'declined' ? 'pill border-dashed !text-muted' : 'pill'}>
      {status === 'accepted' && <span className="status-dot" />}
      {STATUS[status]}
    </span>
  );
}

// The site's own address, for building a booking link the client can open.
function siteAddress() {
  const h = headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? '';
  const proto = h.get('x-forwarded-proto') ?? (/^(localhost|127\.)/.test(host) ? 'http' : 'https');
  return `${proto}://${host}`;
}

export default async function AdminEnquiriesPage({ searchParams }: { searchParams: { id?: string; show?: string } }) {
  await requireOwner('/admin/enquiries');
  const [ready, all, bookings, settings, messages, profile] = await Promise.all([
    enquiriesReady(), getOwnerEnquiries(), getOwnerBookings(), getBookingSettings(), getOwnerMessages(), getProfile(),
  ]);

  const onlyNew = searchParams.show === 'new';
  const newCount = all.filter((e) => e.status === 'new').length;
  const list = onlyNew ? all.filter((e) => e.status === 'new') : all;
  const picked = all.find((e) => e.id === searchParams.id);
  const selected = picked ?? list[0];
  const me = profile?.name ?? '';
  const href = (id: string) => `/admin/enquiries?${onlyNew ? 'show=new&' : ''}id=${encodeURIComponent(id)}`;

  const filter = (label: string, to: string, on: boolean) => (
    <Link href={to} aria-current={on ? 'true' : undefined} className={on ? btnFillClass : btnClass}>
      {label}
    </Link>
  );

  let detail: React.ReactNode = null;
  if (selected) {
    const first = selected.name.split(' ')[0];
    const link = selected.booking_token ? `${siteAddress()}/book/${selected.booking_token}` : '';
    const sessions = bookings.filter((b) => b.enquiry_id === selected.id && b.status !== 'cancelled');
    const hidden = <input type="hidden" name="id" value={selected.id} />;
    const facts = [
      ['Who', selected.job_role],
      ['Company', selected.company],
      ['Where', `${selected.city}, ${selected.country}`],
      ['Needs', selected.need],
      ['Budget', selected.budget],
      ['Start', selected.start_when],
    ];

    detail = (
      <article className={cardClass}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-head text-2xl font-semibold text-primary [overflow-wrap:anywhere]">{selected.name}</h2>
            <p className="text-[13px] text-muted [overflow-wrap:anywhere]">
              {selected.email} · {ownerDate(selected.created_at, settings.timezone)}
            </p>
          </div>
          <StatusTag status={selected.status} />
        </div>

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
          {facts.map(([k, v]) => (
            <div key={k} className="bg-surface px-3.5 py-2.5">
              <dt className="label">{k}</dt>
              <dd className="text-primary [overflow-wrap:anywhere]">{v}</dd>
            </div>
          ))}
        </dl>

        <div>
          <h3 className="label mb-1">What they want</h3>
          {/* Written by a stranger: shown as plain text only. */}
          <p className="max-w-[72ch] whitespace-pre-line text-secondary [overflow-wrap:anywhere]">{selected.description}</p>
        </div>

        {selected.status === 'accepted' && (
          <div className="grid gap-2 rounded-xl border border-line bg-surface-alt p-3.5">
            <h3 className="font-semibold text-primary">Their booking link</h3>
            <p className="select-all text-[13px] text-secondary [overflow-wrap:anywhere]">{link}</p>
            <div className="flex flex-wrap gap-2">
              <a
                className={btnFillClass}
                href={mailDraft(
                  selected.email,
                  'Book your session',
                  `Hello ${first},\n\nThank you for your enquiry. I would like to take this on.\n\nBook a session here. The link is personal, so please do not share it:\n${link}\n\n${me}`,
                )}>
                Email them the link
              </a>
              <CopyButton text={link} label="Copy link" />
            </div>
            {!settings.rate_usd && (
              <p className="text-[13px] text-muted">
                Booking is closed until you <Link href="/admin/bookings#price" className="underline">set your hourly rate</Link>.
              </p>
            )}
          </div>
        )}

        {sessions.length > 0 && (
          <div>
            <h3 className="label mb-1">Their sessions</h3>
            <ul className="text-secondary">
              {sessions.map((b) => (
                <li key={b.id}>
                  {ownerDay(b.starts_at, settings.timezone)}, {ownerClock(b.starts_at, settings.timezone)} · {b.hours} h · {usd(Number(b.total_usd))} ·{' '}
                  {b.status === 'paid' ? 'Paid' : 'Waiting for payment'}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 border-t border-line pt-3.5">
          {selected.status !== 'accepted' && (
            <form action={acceptEnquiry}>
              {hidden}
              <button type="submit" className={selected.status === 'new' ? btnFillClass : btnClass}>
                Accept and create booking link
              </button>
            </form>
          )}
          <a className={btnClass} href={mailDraft(selected.email, 'Re: your enquiry', `Hello ${first},\n\n`)}>
            Reply by email
          </a>
          {selected.status !== 'declined' ? (
            <form action={declineEnquiry}>
              {hidden}
              {selected.status === 'accepted' ? (
                <ConfirmButton question="Switch off this booking link? Unpaid sessions are cancelled. Paid ones stay: settle those with the client." className={btnClass}>
                  Switch off the link
                </ConfirmButton>
              ) : (
                <button type="submit" className={btnClass}>Decline politely</button>
              )}
            </form>
          ) : (
            <>
              <a
                className={btnClass}
                href={mailDraft(
                  selected.email,
                  'Re: your enquiry',
                  `Hello ${first},\n\nThank you for writing, and for the detail you shared. I am not able to take this on right now.\n\nI wish you well with it.\n\n${me}`,
                )}>
                Send the polite reply
              </a>
              <form action={reopenEnquiry}>
                {hidden}
                <button type="submit" className={btnClass}>Move back to new</button>
              </form>
            </>
          )}
          <form action={deleteEnquiry} className="ml-auto">
            {hidden}
            <ConfirmButton question={`Delete the enquiry from ${selected.name}, and any sessions they booked? This cannot be undone.`} className={deleteClass}>
              Delete
            </ConfirmButton>
          </form>
        </div>
      </article>
    );
  }

  return (
    <div>
      <PageHead title="Enquiries">
        {filter('All', '/admin/enquiries', !onlyNew)}
        {filter(`New (${newCount})`, '/admin/enquiries?show=new', onlyNew)}
      </PageHead>
      <ExplainNote>
        People who asked to work with you. Nothing is sent without you: accepting creates a booking link, and you email it from your own
        inbox.
      </ExplainNote>

      {!ready ? (
        <p className="mb-4 rounded-xl border border-line bg-surface-alt p-4">
          <b>Not set up yet:</b> run <code>supabase/005_enquiries_bookings.sql</code> in the Supabase SQL editor.
        </p>
      ) : list.length === 0 && !picked ? (
        <p className="text-muted">{onlyNew ? 'Nothing new.' : 'No enquiries yet.'}</p>
      ) : (
        // Phones show the list, or one enquiry; wide screens show both.
        <div className="grid items-start gap-4 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
          <ul className={`gap-2 ${picked ? 'hidden lg:grid' : 'grid'}`}>
            {list.map((e) => (
              <li key={e.id}>
                <Link
                  href={href(e.id)}
                  aria-current={selected?.id === e.id ? 'true' : undefined}
                  className={`grid gap-1 rounded-xl border bg-surface px-3.5 py-3 ${selected?.id === e.id ? 'lg:border-primary' : ''} border-line hover:border-muted`}>
                  <span className="flex items-center justify-between gap-2">
                    <b className="truncate text-primary">{e.name}</b>
                    <StatusTag status={e.status} />
                  </span>
                  <span className="truncate text-[13px] text-secondary">{e.need} · {e.company}</span>
                  <span className="truncate text-xs text-muted">
                    {e.city}, {e.country} · {ownerDay(e.created_at, settings.timezone)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className={picked ? '' : 'hidden lg:block'}>
            {picked && (
              <Link href={onlyNew ? '/admin/enquiries?show=new' : '/admin/enquiries'} className="mb-3 inline-block text-muted lg:hidden">
                &larr; All enquiries
              </Link>
            )}
            {detail}
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <section id="earlier" className="mt-8 scroll-mt-20">
          <h2 className="label mb-3">Earlier messages (from the short message box)</h2>
          <ul className="grid gap-3 xl:grid-cols-2">
            {messages.map((m) => (
              <li key={m.id} className={`flex flex-col gap-2 rounded-xl border bg-surface p-4 ${m.is_read ? 'border-line' : 'border-primary'}`}>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <b className="text-primary">{m.name}</b>
                  <span className="text-xs text-muted [overflow-wrap:anywhere]">{m.email} · {ownerDate(m.created_at, settings.timezone)}</span>
                </p>
                <p className="whitespace-pre-line text-secondary [overflow-wrap:anywhere]">{m.body}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <a href={mailDraft(m.email, 'Re: your message')} className={smallClass}>Reply by email</a>
                  <form action={setMessageRead}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="read" value={m.is_read ? 'no' : 'yes'} />
                    <button type="submit" className={smallClass}>{m.is_read ? 'Mark as new' : 'Mark as read'}</button>
                  </form>
                  <form action={deleteMessage}>
                    <input type="hidden" name="id" value={m.id} />
                    <ConfirmButton question={`Delete the message from ${m.name}?`} className={deleteClass}>Delete</ConfirmButton>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

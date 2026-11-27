import Link from 'next/link';
import { headers } from 'next/headers';
import ConfirmButton from '../_ConfirmButton';
import CopyButton from '../_CopyButton';
import { deleteMessage, setMessageRead } from '../messages/actions';
import {
  acceptEnquiry, addPaidHours, confirmCall, confirmPayment, declineEnquiry, deleteEnquiry, rejectPayment, releaseCall, removePayment, reopenEnquiry,
} from './actions';
import { ExplainNote, PageHead, btnClass, btnFillClass, cardClass, deleteClass, fieldClass, smallClass } from '../_ui';
import { mailDraft, ownerClock, ownerDate, ownerDay } from '../_format';
import { replyNote, usd } from '@/lib/booking';
import { getProfile } from '@/lib/content';
import {
  enquiriesReady, getBookingSettings, getOwnerBookings, getOwnerEnquiries, getOwnerPayments, paymentsReady, type Enquiry,
} from '@/lib/enquiries';
import { getOwnerMessages } from '@/lib/messages';
import { requireOwner } from '@/lib/owner';

export const dynamic = 'force-dynamic';

const STATUS = { new: 'New', accepted: 'Accepted', declined: 'Declined' } as const;
const offerTag = 'rounded-full bg-primary px-2.5 py-1 text-[11.5px] font-semibold leading-none text-inverse';

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

// A one-button form for an action on one record.
function Act({ action, id, className, ask, children }: {
  action: (formData: FormData) => Promise<void>; id: string; className: string; ask?: string; children: React.ReactNode;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      {ask ? (
        <ConfirmButton question={ask} className={className}>{children}</ConfirmButton>
      ) : (
        <button type="submit" className={className}>{children}</button>
      )}
    </form>
  );
}

export default async function AdminEnquiriesPage({ searchParams }: { searchParams: { id?: string; show?: string } }) {
  await requireOwner('/admin/enquiries');
  const [ready, twoPaths, all, bookings, payments, settings, messages, profile] = await Promise.all([
    enquiriesReady(), paymentsReady(), getOwnerEnquiries(), getOwnerBookings(), getOwnerPayments(), getBookingSettings(), getOwnerMessages(), getProfile(),
  ]);

  const claimed = new Set(payments.filter((p) => p.status === 'claimed').map((p) => p.enquiry_id));
  const needsYou = (e: Enquiry) => e.status === 'new' || claimed.has(e.id);
  // Job offers waiting come first, then payments to check, then other new ones.
  const rank = (e: Enquiry) => (e.kind === 'offer' && e.status === 'new' ? 0 : claimed.has(e.id) ? 1 : e.status === 'new' ? 2 : 3);
  const sorted = [...all].sort((a, b) => rank(a) - rank(b)); // stays newest first within each group

  const onlyNew = searchParams.show === 'new';
  const waitingCount = all.filter(needsYou).length;
  const list = onlyNew ? sorted.filter(needsYou) : sorted;
  const picked = all.find((e) => e.id === searchParams.id);
  const selected = picked ?? list[0];
  const me = profile?.name ?? '';
  const href = (id: string) => `/admin/enquiries?${onlyNew ? 'show=new&' : ''}id=${encodeURIComponent(id)}`;
  const when = (iso: string) => `${ownerDay(iso, settings.timezone)}, ${ownerClock(iso, settings.timezone)}`;

  const filter = (label: string, to: string, on: boolean) => (
    <Link href={to} aria-current={on ? 'true' : undefined} className={on ? btnFillClass : btnClass}>
      {label}
    </Link>
  );

  let detail: React.ReactNode = null;
  if (selected) {
    const offer = selected.kind === 'offer';
    const first = selected.name.split(' ')[0];
    const link = selected.booking_token ? `${siteAddress()}/book/${selected.booking_token}` : '';
    const theirs = bookings.filter((b) => b.enquiry_id === selected.id && b.status !== 'cancelled');
    const call = theirs.find((b) => b.kind === 'call' && Date.parse(b.ends_at) > Date.now());
    const pastCall = theirs.find((b) => b.kind === 'call' && b.status === 'confirmed' && Date.parse(b.ends_at) <= Date.now());
    const noCall = pastCall ? `Call was ${when(pastCall.starts_at)}` : 'No time is held';
    const sessions = theirs.filter((b) => b.kind === 'consultation');
    const money = payments.filter((p) => p.enquiry_id === selected.id);
    const facts = offer
      ? [
          ['Who', selected.job_role],
          ['Company', selected.company],
          ['Where', `${selected.city}, ${selected.country}`],
          ['Pay range', selected.budget],
          ['Call', call ? `${when(call.starts_at)} (${call.status === 'confirmed' ? 'confirmed' : 'to confirm'})` : noCall],
          ['Reply', selected.status === 'new' ? replyNote(selected.created_at) : 'Answered'],
        ]
      : [
          ['Who', selected.job_role],
          ['Company', selected.company],
          ['Where', `${selected.city}, ${selected.country}`],
          ['Needs', selected.need],
          ['Budget', selected.budget],
          ['Start', selected.start_when],
        ];
    const callTime = call ? `${when(call.starts_at)} (${settings.timezone} time)` : '';

    detail = (
      <article className={cardClass}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-head text-2xl font-semibold text-primary [overflow-wrap:anywhere]">{selected.name}</h2>
            <p className="text-[13px] text-muted [overflow-wrap:anywhere]">
              {selected.email} · {ownerDate(selected.created_at, settings.timezone)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {offer && <span className={offerTag}>Job offer</span>}
            <StatusTag status={selected.status} />
          </div>
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
          <h3 className="label mb-1">{offer ? 'The role or offer' : 'What they want'}</h3>
          {/* Written by a stranger: shown as plain text only. */}
          <p className="max-w-[72ch] whitespace-pre-line text-secondary [overflow-wrap:anywhere]">{selected.description}</p>
        </div>

        {offer && selected.status !== 'declined' && (
          <div className="grid gap-2 rounded-xl border border-line bg-surface-alt p-3.5">
            <h3 className="font-semibold text-primary">
              {!call ? noCall : call.status === 'confirmed' ? `Call confirmed: ${callTime}` : `They asked for: ${callTime}`}
            </h3>
            <div className="flex flex-wrap gap-2">
              {call?.status === 'requested' && <Act action={confirmCall} id={selected.id} className={btnFillClass}>Confirm call</Act>}
              {call?.status === 'confirmed' && (
                <a
                  className={btnFillClass}
                  href={mailDraft(
                    selected.email,
                    'Our call is confirmed',
                    `Hello ${first},\n\nThank you. Our call is confirmed for ${callTime}.\n\n${settings.call_link ? `Join here: ${settings.call_link}` : 'I will send the link before we start.'}\n\n${me}`,
                  )}>
                  Email them the call details
                </a>
              )}
              {call ? (
                <Act action={releaseCall} id={selected.id} className={btnClass}
                  ask="Free this time? Then email them to agree another one.">
                  {call.status === 'confirmed' ? 'Move the call' : 'Suggest another time'}
                </Act>
              ) : (
                <a className={btnClass} href={mailDraft(selected.email, 'A time for our call', `Hello ${first},\n\nThank you for your message. Could we speak at \n\n${me}`)}>
                  Suggest a time by email
                </a>
              )}
            </div>
            {call && !settings.call_link && (
              <p className="text-[13px] text-muted">
                Save your meeting link in <Link href="/admin/settings" className="underline">Settings</Link> to have it put in the email.
              </p>
            )}
          </div>
        )}

        {!offer && selected.status === 'accepted' && (
          <div className="grid gap-2 rounded-xl border border-line bg-surface-alt p-3.5">
            <h3 className="font-semibold text-primary">Their booking link</h3>
            <p className="select-all text-[13px] text-secondary [overflow-wrap:anywhere]">{link}</p>
            <div className="flex flex-wrap gap-2">
              <a
                className={btnFillClass}
                href={mailDraft(
                  selected.email,
                  'Book your session',
                  `Hello ${first},\n\nThank you for your enquiry. I would like to take this on.\n\nPay and then pick your time here. The link is personal, so please do not share it:\n${link}\n\n${me}`,
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

        {/* Payment records stay in reach after a decline: money may still need an answer. */}
        {!offer && (selected.status === 'accepted' || money.length > 0) && (
          <div className="grid gap-2 rounded-xl border border-line p-3.5">
            <h3 className="font-semibold text-primary">Payments</h3>
            {money.length === 0 && <p className="text-[13px] text-muted">Nothing yet.</p>}
            <ul className="grid gap-2">
              {money.map((p) => (
                <li key={p.id} className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border p-2.5 ${p.status === 'claimed' ? 'border-primary' : 'border-line'}`}>
                  <span>
                    <b className="text-primary">{usd(p.total_usd)}</b> · {p.hours} h ·{' '}
                    <span className="text-muted">
                      {p.status === 'claimed' ? 'says they paid: check your account' : p.status === 'confirmed' ? 'paid, no time picked yet' : p.status === 'rejected' ? 'not found' : 'used for a session'}
                    </span>
                  </span>
                  <span className="flex flex-wrap items-center gap-2">
                    {p.status === 'claimed' && (
                      <>
                        <Act action={confirmPayment} id={p.id} className={btnFillClass}>Payment received</Act>
                        <Act action={rejectPayment} id={p.id} className={btnClass}>Not yet</Act>
                      </>
                    )}
                    {(p.status === 'confirmed' || p.status === 'rejected') && (
                      <Act action={removePayment} id={p.id} className={deleteClass} ask="Remove this payment record? Do this after a refund, or if it never arrived.">
                        Remove
                      </Act>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            {selected.status === 'accepted' && settings.rate_usd && twoPaths && (
              <form action={addPaidHours} className="flex flex-wrap items-center gap-2 border-t border-line pt-2.5">
                <input type="hidden" name="id" value={selected.id} />
                <span className="text-[13px] text-muted">Money arrived without a press?</span>
                <select name="hours" aria-label="Hours paid for" className={`${fieldClass} !w-auto`}>
                  {Array.from({ length: settings.max_hours }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n} h</option>
                  ))}
                </select>
                <ConfirmButton question="Record these hours as paid? The client can then pick a time." className={smallClass}>
                  Add paid hours
                </ConfirmButton>
              </form>
            )}
          </div>
        )}

        {sessions.length > 0 && (
          <div>
            <h3 className="label mb-1">Their sessions</h3>
            <ul className="text-secondary">
              {sessions.map((b) => (
                <li key={b.id}>
                  {when(b.starts_at)} · {b.hours} h · {usd(b.total_usd)} · {b.status === 'paid' ? 'Paid' : 'Not paid'}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 border-t border-line pt-3.5">
          {!offer && selected.status !== 'accepted' && (
            <Act action={acceptEnquiry} id={selected.id} className={selected.status === 'new' ? btnFillClass : btnClass}>
              Accept and create booking link
            </Act>
          )}
          <a className={btnClass} href={mailDraft(selected.email, 'Re: your message', `Hello ${first},\n\n`)}>
            Reply by email
          </a>
          {selected.status === 'new' && <Act action={declineEnquiry} id={selected.id} className={btnClass}>Decline politely</Act>}
          {selected.status === 'accepted' && (
            <Act action={declineEnquiry} id={selected.id} className={btnClass}
              ask={offer ? 'Decline this offer? Any held call time is freed.' : 'Switch off this booking link? Paid sessions stay: settle those with the client.'}>
              {offer ? 'Decline' : 'Switch off the link'}
            </Act>
          )}
          {selected.status === 'declined' && (
            <>
              <a
                className={btnClass}
                href={mailDraft(
                  selected.email,
                  'Re: your message',
                  `Hello ${first},\n\nThank you for writing, and for the detail you shared. I am not able to take this on right now.\n\nI wish you well with it.\n\n${me}`,
                )}>
                Send the polite reply
              </a>
              <Act action={reopenEnquiry} id={selected.id} className={btnClass}>Move back to new</Act>
            </>
          )}
          <div className="ml-auto">
            <Act action={deleteEnquiry} id={selected.id} className={deleteClass}
              ask={`Delete everything from ${selected.name}, including sessions and payment records? This cannot be undone.`}>
              Delete
            </Act>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div>
      <PageHead title="Enquiries">
        {filter('All', '/admin/enquiries', !onlyNew)}
        {filter(`Waiting (${waitingCount})`, '/admin/enquiries?show=new', onlyNew)}
      </PageHead>
      <ExplainNote>
        Job offers come first: confirm the call within a day. For a consultation, accept it, email the link, and press &ldquo;Payment
        received&rdquo; once you see the money. Nothing is sent without you.
      </ExplainNote>

      {ready && !twoPaths && (
        <p className="mb-4 rounded-xl border border-line bg-surface-alt p-4">
          <b>One step left:</b> run <code>supabase/006_pay_first_and_offers.sql</code> in the Supabase SQL editor. Until then clients cannot
          pay or book, and recruiters cannot pick a time.
        </p>
      )}
      {!ready ? (
        <p className="mb-4 rounded-xl border border-line bg-surface-alt p-4">
          <b>Not set up yet:</b> run <code>supabase/005_enquiries_bookings.sql</code> in the Supabase SQL editor.
        </p>
      ) : list.length === 0 && !picked ? (
        <p className="text-muted">{onlyNew ? 'Nothing is waiting.' : 'No enquiries yet.'}</p>
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
                  {(e.kind === 'offer' || claimed.has(e.id)) && (
                    <span className="flex flex-wrap items-center gap-2">
                      {e.kind === 'offer' && <span className={offerTag}>Job offer</span>}
                      {e.kind === 'offer' && e.status === 'new' && <span className="text-xs text-primary">{replyNote(e.created_at)}</span>}
                      {claimed.has(e.id) && <span className="pill border-dashed">Says they paid</span>}
                    </span>
                  )}
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
                  <Act action={deleteMessage} id={m.id} className={deleteClass} ask={`Delete the message from ${m.name}?`}>Delete</Act>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

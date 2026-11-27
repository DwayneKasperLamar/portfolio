import ConfirmButton from '../_ConfirmButton';
import { deleteMessage, saveWhatsApp, setMessageRead } from './actions';
import { ExplainNote, PageHead, cardClass, fieldClass, labelClass, saveClass } from '../_ui';
import { getOwnerItems, LISTS } from '@/lib/content';
import { alertsConfigured, getOwnerMessages, messagesReady } from '@/lib/messages';

export const dynamic = 'force-dynamic';

const small = 'rounded-lg border border-line px-3 py-1.5 text-xs text-primary hover:border-muted';
const when = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Lagos' }).format(new Date(iso));

export default async function AdminMessagesPage() {
  const [ready, messages, contact] = await Promise.all([messagesReady(), getOwnerMessages(), getOwnerItems(LISTS.contact)]);
  const whatsapp = contact.find((c) => c.url?.startsWith('https://wa.me/'))?.url?.replace('https://wa.me/', '+') ?? '';

  return (
    <div>
      <PageHead title="Messages" />
      <ExplainNote>People who wrote through your site&rsquo;s message box. Only you can see this. Reply opens your email app.</ExplainNote>

      {!ready && (
        <p className="mb-4 rounded-xl border border-line bg-surface-alt p-4 text-sm">
          <b>Not set up yet:</b> run <code>supabase/004_messages.sql</code> in the Supabase SQL editor. Until then the form is hidden on your site.
        </p>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          {messages.length === 0 ? (
            <p className="text-muted">No messages yet.</p>
          ) : (
            <ul className="grid gap-3">
              {messages.map((m) => (
                <li key={m.id} className={`flex flex-col gap-2 rounded-xl border bg-surface p-4 ${m.is_read ? 'border-line' : 'border-primary'}`}>
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {!m.is_read && <span className="status-dot" aria-label="new" />}
                    <b className="text-primary">{m.name}</b>
                    <span className="break-all text-xs text-muted">{m.email} · {when(m.created_at)}</span>
                  </p>
                  <p className="whitespace-pre-line break-words text-secondary">{m.body}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <a href={`mailto:${encodeURIComponent(m.email).replace('%40', '@')}?subject=${encodeURIComponent('Re: your message')}`}
                      className={`${small} bg-primary !text-inverse`}>
                      Reply by email
                    </a>
                    <form action={setMessageRead}>
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="read" value={m.is_read ? 'no' : 'yes'} />
                      <button type="submit" className={small}>{m.is_read ? 'Mark as new' : 'Mark as read'}</button>
                    </form>
                    <form action={deleteMessage}>
                      <input type="hidden" name="id" value={m.id} />
                      <ConfirmButton question={`Delete the message from ${m.name}?`} className="text-xs text-muted underline hover:text-primary">
                        Delete
                      </ConfirmButton>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid gap-4">
          <form action={saveWhatsApp} className={cardClass}>
            <label>
              <span className={labelClass}>WhatsApp number (public)</span>
              <input name="number" defaultValue={whatsapp} placeholder="+234…" inputMode="tel" maxLength={24} className={fieldClass} />
            </label>
            <p className="text-sm text-muted">
              With the country code. Anyone visiting your site can see it, so use a work number if you have one. Empty it to remove the button.
            </p>
            <button type="submit" className={saveClass}>Save number</button>
          </form>
          <div className={cardClass}>
            <span className={labelClass}>Email alerts</span>
            <p className="text-sm">
              {alertsConfigured() ? 'On: you get an email for each new message.' : 'Off. Messages are still saved here.'}
            </p>
            {!alertsConfigured() && (
              <p className="text-sm text-muted">
                To switch on: create a Resend account with the email that should get alerts, then add <code>RESEND_API_KEY</code> and{' '}
                <code>ALERT_EMAIL</code> in Vercel and redeploy.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

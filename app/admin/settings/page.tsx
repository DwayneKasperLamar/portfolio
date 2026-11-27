import { savePayment } from './actions';
import { saveWhatsApp } from '../messages/actions';
import { ExplainNote, PageHead, btnFillClass, cardClass, fieldClass, labelClass } from '../_ui';
import { getOwnerItems, LISTS } from '@/lib/content';
import { enquiriesReady, getBookingSettings } from '@/lib/enquiries';
import { alertsConfigured } from '@/lib/messages';
import { requireOwner } from '@/lib/owner';

export const dynamic = 'force-dynamic';

const TRACKED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'ADMIN_PASSWORD',
  'ADMIN_SESSION_SECRET',
  'RESEND_API_KEY', // optional: email alerts for new enquiries and bookings
  'ALERT_EMAIL', // optional: where the alerts go
] as const;

const PROBLEMS: Record<string, string> = {
  link: 'The payment link must start with https:// and have no spaces.',
  note: 'Keep the payment note under 500 characters.',
  number: 'Use the full number with the country code, for example +234 followed by the number without its first 0.',
};

export default async function AdminSettingsPage({ searchParams }: { searchParams: { problem?: string; saved?: string } }) {
  await requireOwner('/admin/settings');
  const [ready, settings, contact] = await Promise.all([enquiriesReady(), getBookingSettings(), getOwnerItems(LISTS.contact)]);
  const whatsapp = contact.find((c) => c.url?.startsWith('https://wa.me/'))?.url?.replace('https://wa.me/', '+') ?? '';
  const problem = searchParams.problem ? PROBLEMS[searchParams.problem] : null;

  return (
    <div>
      <PageHead title="Settings" />
      <ExplainNote>How you get notified, how clients pay you, and your WhatsApp button.</ExplainNote>
      {problem && <p role="alert" className="mb-4 rounded-xl border border-primary bg-surface-alt p-3 font-medium">{problem}</p>}
      {(searchParams.saved === 'payment' || searchParams.saved === 'whatsapp') && (
        <p role="status" className="mb-4 rounded-xl border border-line bg-surface-alt p-3">
          {searchParams.saved === 'payment' ? 'Payment details saved.' : 'WhatsApp number saved.'}
        </p>
      )}

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <section className={cardClass}>
          <h2 className="font-semibold text-primary">Email alerts</h2>
          <p>{alertsConfigured() ? 'On: you get an email for each new enquiry and booking.' : 'Off. Everything is still saved here.'}</p>
          {!alertsConfigured() && (
            <p className="text-[13px] text-muted">
              To switch on: create a Resend account with the email that should get alerts, then add <code>RESEND_API_KEY</code> and{' '}
              <code>ALERT_EMAIL</code> in Vercel and redeploy. Alerts go only to you. The site never emails clients.
            </p>
          )}
        </section>

        <form action={savePayment} className={cardClass}>
          <h2 className="font-semibold text-primary">How clients pay</h2>
          <label>
            <span className={labelClass}>Payment link</span>
            <input name="payment_link" type="url" maxLength={500} defaultValue={settings.payment_link ?? ''} placeholder="https://" className={fieldClass} />
          </label>
          <label>
            <span className={labelClass}>Note shown with it</span>
            <textarea name="payment_note" rows={3} maxLength={500} defaultValue={settings.payment_note ?? ''}
              placeholder="For example: put your name in the payment reference." className={fieldClass} />
          </label>
          <p className="text-[13px] text-muted">
            Only accepted clients see these, on their booking page. Use a link that takes US dollars. The site cannot see payments: you mark
            sessions paid under Bookings.
          </p>
          <button type="submit" disabled={!ready} className={`${btnFillClass} self-start`}>Save payment details</button>
        </form>

        <form action={saveWhatsApp} className={cardClass}>
          <h2 className="font-semibold text-primary">WhatsApp button</h2>
          <label>
            <span className={labelClass}>Number (public)</span>
            <input name="number" defaultValue={whatsapp} placeholder="+234…" inputMode="tel" maxLength={24} className={fieldClass} />
          </label>
          <p className="text-[13px] text-muted">
            With the country code. Anyone visiting your site can see it and message you without an enquiry, so leave it empty if every client
            should use the form.
          </p>
          <button type="submit" className={`${btnFillClass} self-start`}>Save number</button>
        </form>

        <section className={cardClass}>
          <h2 className="font-semibold text-primary">Server keys</h2>
          <p className="text-[13px] text-muted">
            Only whether each is set. Values are never shown: change them in Vercel (live site) or <code>.env.local</code> (your computer).
          </p>
          <ul>
            {TRACKED_ENV_VARS.map((key) => {
              const set = Boolean(process.env[key]);
              return (
                <li key={key} className="flex items-center justify-between gap-3 border-t border-line py-2 first:border-t-0">
                  <span className="font-mono text-xs text-secondary [overflow-wrap:anywhere]">{key}</span>
                  <span className={set ? 'pill' : 'pill border-dashed !text-muted'}>
                    {set && <span className="status-dot" />}
                    {set ? 'set' : 'not set'}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}

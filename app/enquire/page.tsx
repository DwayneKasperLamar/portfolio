import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/PageShell';
import EnquiryForm from '@/components/EnquiryForm';
import OfferForm from '@/components/OfferForm';
import { REPLY_HOURS, openSlots } from '@/lib/booking';
import { getProfile } from '@/lib/content';
import { enquiriesReady, getBlockedDays, getBookingSettings, getBusyTimes, paymentsReady } from '@/lib/enquiries';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Work with me — Dwayne Kasper' };

const choice = 'grid gap-2 rounded-2xl border bg-surface p-5 transition-colors hover:border-muted';

export default async function EnquirePage({ searchParams }: { searchParams: { for?: string } }) {
  const [ready, twoPaths, profile] = await Promise.all([enquiriesReady(), paymentsReady(), getProfile()]);
  const path = searchParams.for === 'offer' || searchParams.for === 'consultation' ? searchParams.for : null;
  const emailMe = (lead: string) => (
    <p>
      {lead} Please email me
      {profile?.email && (
        <>
          {' '}at{' '}
          <a href={`mailto:${profile.email}`} className="underline">
            {profile.email}
          </a>
        </>
      )}
      .
    </p>
  );

  if (path === 'offer') {
    const [settings, blocked, busy] = await Promise.all([getBookingSettings(), getBlockedDays(), getBusyTimes()]);
    const slots = ready && twoPaths && busy ? openSlots({ ...settings, max_hours: 1 }, busy, blocked) : [];
    return (
      <PageShell title="Book a free call" subtitle={`Tell me about the role, then pick a time. I reply within ${REPLY_HOURS} hours.`} backHref="/enquire" backLabel="← Back">
        {slots.length > 0 ? <OfferForm slots={slots} /> : emailMe('Booking a call is not open right now.')}
      </PageShell>
    );
  }

  // The chooser shows only once both paths work; until then there is just the consultation form.
  if (ready && twoPaths && !path) {
    return (
      <PageShell title="What brings you here?" subtitle="Choose one. Both start with who you are and what you need.">
        <div className="grid gap-4">
          <Link href="/enquire?for=consultation" className={`${choice} border-line`}>
            <span className="font-head text-xl font-semibold text-primary">I want a consultation</span>
            <span className="text-sm text-secondary">
              Paid, per hour, in US dollars. Tell me what you need. If I accept, you pay and then pick your time.
            </span>
            <span className="mt-1 text-[13px] font-semibold text-primary">Start an enquiry &rarr;</span>
          </Link>
          <Link href="/enquire?for=offer" className={`${choice} border-primary`}>
            <span className="font-head text-xl font-semibold text-primary">I am hiring, or I have an offer</span>
            <span className="text-sm text-secondary">Free. Tell me about the role, then pick a date and time for a call.</span>
            <span className="flex items-center gap-2 text-[13px] text-secondary">
              <span className="status-dot" />I reply within {REPLY_HOURS} hours
            </span>
            <span className="mt-1 text-[13px] font-semibold text-primary">Book a free call &rarr;</span>
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Tell me who you are and what you need"
      subtitle="I read every enquiry. If it is a fit, you get a link to pay and book a session."
      backHref={twoPaths ? '/enquire' : '/'}
      backLabel={twoPaths ? '← Back' : '← Home'}>
      {ready ? <EnquiryForm /> : emailMe('The enquiry form is being set up.')}
    </PageShell>
  );
}

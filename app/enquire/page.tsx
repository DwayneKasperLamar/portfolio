import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import EnquiryForm from '@/components/EnquiryForm';
import { getProfile } from '@/lib/content';
import { enquiriesReady } from '@/lib/enquiries';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Work with me — Dwayne Kasper' };

export default async function EnquirePage() {
  const [ready, profile] = await Promise.all([enquiriesReady(), getProfile()]);

  return (
    <PageShell title="Tell me who you are and what you need" subtitle="I read every enquiry. If it is a fit, you get a link to book a session.">
      {ready ? (
        <EnquiryForm />
      ) : (
        <p>
          The enquiry form is being set up. Please email me at{' '}
          <a href={`mailto:${profile?.email}`} className="underline">
            {profile?.email}
          </a>
          .
        </p>
      )}
    </PageShell>
  );
}

import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import JournalList from '@/components/JournalList';
import { getPublicJournal } from '@/lib/content';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Journal — Dwayne Kasper' };

export default async function JournalPage() {
  const entries = await getPublicJournal();

  return (
    <PageShell title="Journal" subtitle="Newest first">
      {entries.length === 0 ? <p className="text-muted">Nothing here yet.</p> : <JournalList entries={entries} />}
    </PageShell>
  );
}

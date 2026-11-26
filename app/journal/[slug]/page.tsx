import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import BodyText from '@/components/BodyText';
import { getPublicJournalEntry } from '@/lib/content';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const entry = await getPublicJournalEntry(params.slug);
  return { title: entry ? `${entry.title} — Dwayne Kasper` : 'Journal' };
}

export default async function JournalEntryPage({ params }: { params: { slug: string } }) {
  const entry = await getPublicJournalEntry(params.slug);
  if (!entry) notFound();

  return (
    <PageShell
      title={entry.title}
      subtitle={[entry.entry_date, entry.mood].filter(Boolean).join(' · ')}
      backHref="/journal"
      backLabel="← Journal">
      <BodyText text={entry.body} />
      {entry.tags.length > 0 && <p className="font-sans text-xs text-muted mt-8">{entry.tags.map((t) => `#${t}`).join('  ')}</p>}
    </PageShell>
  );
}

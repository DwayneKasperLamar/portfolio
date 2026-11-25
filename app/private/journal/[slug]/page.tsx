import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import BodyText from '@/components/BodyText';
import { getOwnerJournalEntry } from '@/lib/content';

export default async function PrivateJournalEntry({ params }: { params: { slug: string } }) {
  const entry = await getOwnerJournalEntry(params.slug);
  if (!entry) notFound();

  return (
    <PageShell
      title={entry.title}
      subtitle={[entry.entry_date, entry.mood, entry.visibility].filter(Boolean).join(' · ')}
      hideNav
      backHref="/private"
      backLabel="← Private">
      <BodyText text={entry.body} />
      {entry.tags.length > 0 && <p className="font-mono text-xs text-muted mt-8">{entry.tags.map((t) => `#${t}`).join('  ')}</p>}
    </PageShell>
  );
}

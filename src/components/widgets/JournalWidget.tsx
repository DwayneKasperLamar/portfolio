import Link from 'next/link';
import type { JournalEntry } from '@/lib/content';
import WidgetCard from '@/components/widgets/WidgetCard';

// The newest PUBLIC journal entry. Private entries can never appear here.
const JournalWidget = ({ entry }: { entry: JournalEntry | null }) => {
  if (!entry) return null;
  return (
    <WidgetCard label="Latest from the journal">
      <p className="font-sans text-xs text-muted mb-1">{entry.entry_date}</p>
      <Link href={`/journal/${entry.slug}`} className="text-[0.95rem] underline decoration-line hover:decoration-primary">
        {entry.title}
      </Link>
    </WidgetCard>
  );
};

export default JournalWidget;

import Link from 'next/link';
import type { JournalEntry } from '@/lib/content';

const JournalList = ({ entries, basePath = '/journal', showVisibility }: { entries: JournalEntry[]; basePath?: string; showVisibility?: boolean }) => (
  <ul className="space-y-4">
    {entries.map((e) => (
      <li key={e.slug}>
        <p className="font-mono text-xs text-muted">
          {e.entry_date}
          {e.mood && ` · ${e.mood}`}
          {showVisibility && ` · ${e.visibility}`}
        </p>
        <Link href={`${basePath}/${e.slug}`} className="underline decoration-line hover:decoration-primary">
          {e.title}
        </Link>
      </li>
    ))}
  </ul>
);

export default JournalList;

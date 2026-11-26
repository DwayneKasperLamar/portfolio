import type { CollectionItem } from '@/lib/content';

// Real words from real people (public `quotes` list): title = name, "author" = their role,
// notes = what they said. The home page shows the block only when there is one.
const Quotes = ({ items }: { items: CollectionItem[] }) => (
  <ul className="space-y-5">
    {items.map((q) => (
      <li key={q.id}>
        <blockquote className="whitespace-pre-line border-l-2 border-line pl-4 text-secondary">{q.notes}</blockquote>
        <p className="mt-1 pl-4 text-xs text-muted">
          {q.title}
          {q.subtitle && ` · ${q.subtitle}`}
        </p>
      </li>
    ))}
  </ul>
);

export default Quotes;

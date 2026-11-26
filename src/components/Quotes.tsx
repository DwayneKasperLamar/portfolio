import type { CollectionItem } from '@/lib/content';
import Section from '@/components/Section';

// Real words from real people (public `quotes` list): title = name, "author" = their role,
// notes = what they said. Shows nothing until there is one.
const Quotes = ({ items }: { items: CollectionItem[] }) => {
  if (items.length === 0) return null;
  return (
    <Section title="What people say">
      <ul className="space-y-5">
        {items.map((q) => (
          <li key={q.id}>
            <blockquote className="border-l-2 border-line pl-4 whitespace-pre-line">{q.notes}</blockquote>
            <p className="font-mono text-xs text-muted mt-1 pl-4">
              {q.title}
              {q.subtitle && ` · ${q.subtitle}`}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
};

export default Quotes;

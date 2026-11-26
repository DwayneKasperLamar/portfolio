import type { CollectionItem } from '@/lib/content';
import BodyText from '@/components/BodyText';
import Section from '@/components/Section';

// A direct "title + one or two sentences" list (how I work with AI, what I do, how I can help).
const TitledList = ({ title, items, children }: { title: string; items: CollectionItem[]; children?: React.ReactNode }) => {
  if (items.length === 0) return null;
  return (
    <Section title={title}>
      <dl className="space-y-4">
        {items.map((item) => (
          <div key={item.id}>
            <dt className="text-[0.95rem] text-primary font-semibold">{item.title}</dt>
            <dd className="text-[0.95rem] text-secondary">
              <BodyText text={item.notes} />
            </dd>
          </div>
        ))}
      </dl>
      {children}
    </Section>
  );
};

export default TitledList;

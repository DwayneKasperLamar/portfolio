import type { CollectionItem } from '@/lib/content';

// The direct "what I do" list under the introduction. Data = the public `what-i-do`
// collection (Admin > Collections).
const WhatIDo = ({ items }: { items: CollectionItem[] }) => {
  if (items.length === 0) return null;
  return (
    <section className="mb-6 mt-10">
      <h2 className="font-mono text-xs uppercase tracking-wider text-muted mb-4">What I do</h2>
      <dl className="space-y-4">
        {items.map((item) => (
          <div key={item.id}>
            <dt className="text-[0.95rem] text-primary font-semibold">{item.title}</dt>
            <dd className="text-[0.95rem] text-secondary">{item.notes}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default WhatIDo;

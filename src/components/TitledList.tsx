import type { CollectionItem } from '@/lib/content';
import BodyText from '@/components/BodyText';

// "Title + a sentence or two". Phone: one under another with thin lines.
//   points  web: a grid with a strong rule above each (how I work with AI)
//   areas   web: a ruled grid of three (what I do)
const layouts = {
  points: {
    list: 'md:grid md:grid-cols-2 md:gap-x-5 md:gap-y-8 lg:grid-cols-3',
    item: 'md:border-t-2 md:border-primary md:pb-0 md:pt-3.5 md:first:border-t-2 md:first:pt-3.5',
  },
  areas: {
    list: 'md:grid md:grid-cols-2 md:border-t md:border-line lg:grid-cols-3',
    item: 'md:border-b md:border-t-0 md:py-5 md:pr-5 md:first:pt-5',
  },
};

const TitledList = ({ items, layout }: { items: CollectionItem[]; layout: keyof typeof layouts }) => (
  <dl className={layouts[layout].list}>
    {items.map((item) => (
      <div key={item.id} className={`border-t border-line py-4 first:border-t-0 first:pt-0 ${layouts[layout].item}`}>
        <dt className="mb-0.5 font-semibold text-primary">{item.title}</dt>
        <dd className="text-secondary md:text-sm">
          <BodyText text={item.notes} />
        </dd>
      </div>
    ))}
  </dl>
);

export default TitledList;

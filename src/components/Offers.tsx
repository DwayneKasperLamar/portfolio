import type { CollectionItem } from '@/lib/content';
import BodyText from '@/components/BodyText';

// What a business can hire me for: one card each, side by side on the web.
const Offers = ({ items }: { items: CollectionItem[] }) => (
  <ul className="grid gap-2.5 md:grid-cols-3 md:gap-5">
    {items.map((item) => (
      <li key={item.id} className="rounded-xl border border-line bg-surface p-4 md:rounded-2xl md:p-6">
        <h3 className="mb-1 font-head text-[17px] font-semibold leading-snug text-primary md:mb-3 md:text-xl">{item.title}</h3>
        <BodyText text={item.notes} className="text-sm text-secondary" />
      </li>
    ))}
  </ul>
);

export default Offers;

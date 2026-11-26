import Link from 'next/link';
import type { CollectionItem } from '@/lib/content';
import { slugify } from '@/lib/slug';

// title = case study name, "author" = where and your role, status = one-line summary.
// `cards` lays them three across on the web (home page).
const CaseStudyList = ({ items, basePath = '/work', cards }: { items: CollectionItem[]; basePath?: string; cards?: boolean }) => (
  <ul className={cards ? 'grid gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-3' : 'space-y-3'}>
    {items.map((item) => (
      <li key={item.id}>
        <Link
          href={`${basePath}/${slugify(item.title)}`}
          className="block h-full rounded-xl border border-line bg-surface p-4 transition-colors hover:border-muted md:rounded-2xl md:p-5">
          {item.subtitle && <span className="mb-1 block text-xs text-muted">{item.subtitle}</span>}
          <span className="block font-head text-lg font-semibold leading-snug text-primary">{item.title}</span>
          {item.status && <span className="mt-1 block text-sm text-secondary">{item.status}</span>}
        </Link>
      </li>
    ))}
  </ul>
);

export default CaseStudyList;

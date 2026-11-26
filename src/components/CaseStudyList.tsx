import Link from 'next/link';
import type { CollectionItem } from '@/lib/content';
import { slugify } from '@/lib/slug';

// title = case study name, "author" = where and your role, status = one-line summary.
const CaseStudyList = ({ items, basePath = '/work' }: { items: CollectionItem[]; basePath?: string }) => (
  <ul className="space-y-3">
    {items.map((item) => (
      <li key={item.id}>
        <Link href={`${basePath}/${slugify(item.title)}`} className="block border border-line rounded-lg p-4 bg-surface hover:border-muted transition-colors">
          {item.subtitle && <span className="block font-mono text-xs text-muted mb-1">{item.subtitle}</span>}
          <span className="block text-primary font-semibold">{item.title}</span>
          {item.status && <span className="block text-sm text-secondary mt-1">{item.status}</span>}
        </Link>
      </li>
    ))}
  </ul>
);

export default CaseStudyList;

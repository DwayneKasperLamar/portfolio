import Link from 'next/link';
import { CollectionForm } from './_forms';
import { ExplainNote, PageHead, VisibilityBadge } from '../_ui';
import { COLLECTION_KIND_LABELS, getOwnerCollections, getOwnerItems } from '@/lib/content';
import { requireOwner } from '@/lib/owner';

export const dynamic = 'force-dynamic';

export default async function AdminCollectionsPage() {
  await requireOwner();
  const [collections, items] = await Promise.all([getOwnerCollections(), getOwnerItems()]);

  return (
    <div>
      <PageHead title="Collections" />
      <ExplainNote>
        Lists of things. An item is public only if both it and its collection are public. Some lists place themselves on the site:
        experience, case-studies, ai-workflow, what-i-do, work-with-me, quotes (real ones only), contact and gallery.
      </ExplainNote>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => {
          const count = items.filter((i) => i.collection_slug === c.slug).length;
          return (
            <li key={c.slug}>
              <Link href={`/admin/collections/${c.slug}`} className="flex h-full flex-col gap-2 rounded-xl border border-line bg-surface p-4 hover:border-muted">
                <span className="font-head text-lg font-semibold text-primary">{c.title}</span>
                <span className="text-sm text-muted">
                  {COLLECTION_KIND_LABELS[c.kind]} · {count} {count === 1 ? 'item' : 'items'}
                </span>
                <span className="mt-auto">
                  <VisibilityBadge value={c.visibility} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <details className="mt-8 max-w-2xl">
        <summary className="btn cursor-pointer">New collection</summary>
        <div className="mt-4">
          <CollectionForm />
        </div>
      </details>
    </div>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CollectionForm, ItemForm } from '../_forms';
import ConfirmButton from '../../_ConfirmButton';
import { deleteCollection, deleteCollectionItem } from '../../actions';
import { PageHead, VisibilityBadge, gridClass } from '../../_ui';
import { COLLECTION_KIND_LABELS, getOwnerCollections, getOwnerItems } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function AdminCollectionPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const [collections, items] = await Promise.all([getOwnerCollections(), getOwnerItems(slug)]);
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) notFound();
  // The Play Store column only exists after supabase/003_profile_and_media.sql has been run.
  const withPlay = items.some((i) => i.play_url !== undefined);

  return (
    <div>
      <Link href="/admin/collections" className="text-sm text-muted hover:text-primary">&larr; Collections</Link>
      <PageHead title={collection.title}>
        <span className="flex items-center gap-3 text-sm text-muted">
          {COLLECTION_KIND_LABELS[collection.kind]} <VisibilityBadge value={collection.visibility} />
        </span>
      </PageHead>

      <ul className={gridClass}>
        {items.map((item) => (
          <li key={item.id} className="rounded-xl border border-line p-3">
            <details>
              <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2 text-primary">
                <span className="font-medium">{item.title}</span>
                <VisibilityBadge value={item.visibility} />
              </summary>
              <div className="mt-3 flex flex-col gap-2">
                <ItemForm collectionSlug={collection.slug} item={item} withPlay={withPlay} />
                <form action={deleteCollectionItem}>
                  <input type="hidden" name="id" value={item.id} />
                  <ConfirmButton question={`Delete "${item.title}"?`} className="text-xs text-muted underline hover:text-primary">
                    Delete
                  </ConfirmButton>
                </form>
              </div>
            </details>
          </li>
        ))}
      </ul>

      <details className="mt-6 max-w-2xl">
        <summary className="btn btn-fill cursor-pointer">Add an item</summary>
        <div className="mt-4">
          <ItemForm collectionSlug={collection.slug} withPlay={withPlay} />
        </div>
      </details>

      <details className="mt-8 max-w-2xl border-t border-line pt-6">
        <summary className="cursor-pointer text-sm text-muted">Collection settings</summary>
        <div className="mt-4 flex flex-col gap-3">
          <CollectionForm collection={collection} />
          <form action={deleteCollection}>
            <input type="hidden" name="slug" value={collection.slug} />
            <ConfirmButton question={`Delete "${collection.title}" and all its items?`} className="text-xs text-muted underline hover:text-primary">
              Delete this collection and all its items
            </ConfirmButton>
          </form>
        </div>
      </details>
    </div>
  );
}

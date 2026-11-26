import { COLLECTION_KINDS, COLLECTION_KIND_LABELS, getOwnerCollections, getOwnerItems } from '@/lib/content';
import type { Collection, CollectionItem } from '@/lib/content';
import { upsertCollection, deleteCollection, upsertCollectionItem, deleteCollectionItem } from '../actions';
import MediaField from '../_MediaField';
import { ExplainNote, VisibilitySelect, VisibilityBadge, fieldClass, labelClass, cardClass, saveClass } from '../_ui';

export const dynamic = 'force-dynamic';

function CollectionForm({ collection }: { collection?: Collection }) {
  return (
    <form action={upsertCollection} className={cardClass}>
      <label>
        <span className={labelClass}>Title</span>
        <input name="title" defaultValue={collection?.title} required className={fieldClass} />
      </label>
      <label>
        <span className={labelClass}>Slug (the web address; leave blank to make one from the title)</span>
        <input name="slug" defaultValue={collection?.slug} readOnly={!!collection} className={fieldClass} />
      </label>
      <label>
        <span className={labelClass}>Type (decides how it looks)</span>
        <select name="kind" defaultValue={collection?.kind ?? 'links'} className={fieldClass}>
          {COLLECTION_KINDS.map((k) => (
            <option key={k} value={k}>
              {COLLECTION_KIND_LABELS[k]}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className={labelClass}>Description</span>
        <textarea name="description" defaultValue={collection?.description} rows={2} className={fieldClass} />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex items-center gap-2 text-sm text-primary">
          <input type="checkbox" name="show_in_nav" defaultChecked={collection?.show_in_nav ?? true} />
          Show in the menu
        </label>
        <label>
          <span className={labelClass}>Menu order</span>
          <input name="sort_order" type="number" defaultValue={collection?.sort_order ?? 0} className={fieldClass} />
        </label>
      </div>
      <VisibilitySelect value={collection?.visibility} />
      <button type="submit" className={saveClass}>
        {collection ? 'Save collection' : 'Add collection'}
      </button>
    </form>
  );
}

function ItemForm({ collectionSlug, item, withPlay }: { collectionSlug: string; item?: CollectionItem; withPlay: boolean }) {
  return (
    <form action={upsertCollectionItem} className="flex flex-col gap-3 border border-line rounded-lg p-3 bg-surface">
      <input type="hidden" name="id" value={item?.id ?? ''} />
      <input type="hidden" name="collection_slug" value={collectionSlug} />
      <div className="grid grid-cols-2 gap-3">
        <label>
          <span className={labelClass}>Title</span>
          <input name="title" defaultValue={item?.title} required className={fieldClass} />
        </label>
        <label>
          <span className={labelClass}>Author / artist / source</span>
          <input name="subtitle" defaultValue={item?.subtitle ?? ''} className={fieldClass} />
        </label>
      </div>
      <MediaField name="image_url" label="Photo, video, cover or logo" defaultValue={item?.image_url} />
      <label>
        <span className={labelClass}>Link (web page, Spotify, or a YouTube video)</span>
        <input name="url" defaultValue={item?.url ?? ''} className={fieldClass} />
      </label>
      {withPlay && (
        <label>
          <span className={labelClass}>Play Store link (shows the Play icon)</span>
          <input name="play_url" defaultValue={item?.play_url ?? ''} className={fieldClass} />
        </label>
      )}
      <label>
        <span className={labelClass}>Notes (blank line = new paragraph; &quot;## Heading&quot;; &quot;Flow: step | step&quot;)</span>
        <textarea name="notes" defaultValue={item?.notes} rows={collectionSlug === 'case-studies' ? 18 : 3} className={fieldClass} />
      </label>
      <div className="grid grid-cols-3 gap-3">
        <label>
          <span className={labelClass}>Status</span>
          <input name="status" defaultValue={item?.status ?? ''} placeholder="reading" className={fieldClass} />
        </label>
        <label>
          <span className={labelClass}>Rating 0-5</span>
          <input name="rating" type="number" min={0} max={5} defaultValue={item?.rating ?? 0} className={fieldClass} />
        </label>
        <label>
          <span className={labelClass}>Order</span>
          <input name="sort_order" type="number" defaultValue={item?.sort_order ?? 0} className={fieldClass} />
        </label>
      </div>
      <VisibilitySelect value={item?.visibility ?? 'public'} />
      <button type="submit" className={saveClass}>
        {item ? 'Save item' : 'Add item'}
      </button>
    </form>
  );
}

export default async function AdminCollectionsPage() {
  const [collections, items] = await Promise.all([getOwnerCollections(), getOwnerItems()]);
  // The Play Store column only exists after supabase/003_profile_and_media.sql has been run.
  const withPlay = items.some((i) => i.play_url !== undefined);

  return (
    <div>
      <h1 className="text-lg font-semibold text-primary mb-2">Collections</h1>
      <ExplainNote>
        Lists of things. An item is public only if both it and its collection are public. Some lists place themselves on the site:
        experience, case-studies (status = one-line summary), ai-workflow, what-i-do, work-with-me, quotes (real ones only) and contact.
      </ExplainNote>

      <h2 className="text-sm font-semibold text-primary mb-3">New collection</h2>
      <div className="mb-10">
        <CollectionForm />
      </div>

      <div className="flex flex-col gap-8">
        {collections.map((collection) => {
          const own = items.filter((i) => i.collection_slug === collection.slug);
          return (
            <details key={collection.slug} className="border-t border-line pt-4">
              <summary className="cursor-pointer text-sm text-primary mb-3 flex gap-3 items-baseline">
                {collection.title}
                <span className="font-mono text-xs text-muted">{COLLECTION_KIND_LABELS[collection.kind]}</span>
                <VisibilityBadge value={collection.visibility} />
                <span className="font-mono text-xs text-muted">{own.length} items</span>
              </summary>

              <CollectionForm collection={collection} />
              <form action={deleteCollection} className="mt-2 mb-6">
                <input type="hidden" name="slug" value={collection.slug} />
                <button type="submit" className="text-xs text-red-500 hover:underline">
                  Delete collection &ldquo;{collection.title}&rdquo; and all its items
                </button>
              </form>

              <h3 className="text-sm font-semibold text-primary mb-3">Items</h3>
              <div className="flex flex-col gap-4">
                {own.map((item) => (
                  <details key={item.id}>
                    <summary className="cursor-pointer text-sm text-primary mb-2 flex gap-3 items-baseline">
                      {item.title}
                      <VisibilityBadge value={item.visibility} />
                    </summary>
                    <ItemForm collectionSlug={collection.slug} item={item} withPlay={withPlay} />
                    <form action={deleteCollectionItem} className="mt-2">
                      <input type="hidden" name="id" value={item.id} />
                      <button type="submit" className="text-xs text-red-500 hover:underline">
                        Delete &ldquo;{item.title}&rdquo;
                      </button>
                    </form>
                  </details>
                ))}
                <details>
                  <summary className="cursor-pointer text-sm text-muted mb-2">+ Add an item</summary>
                  <ItemForm collectionSlug={collection.slug} withPlay={withPlay} />
                </details>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}

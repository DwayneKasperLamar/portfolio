import { COLLECTION_KINDS, COLLECTION_KIND_LABELS } from '@/lib/content';
import type { Collection, CollectionItem } from '@/lib/content';
import { upsertCollection, upsertCollectionItem } from '../actions';
import MediaField from '../_MediaField';
import { VisibilitySelect, fieldClass, labelClass, cardClass, saveClass } from '../_ui';

export function CollectionForm({ collection }: { collection?: Collection }) {
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

export function ItemForm({ collectionSlug, item, withPlay }: { collectionSlug: string; item?: CollectionItem; withPlay: boolean }) {
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


import Link from 'next/link';
import Uploader from './_Uploader';
import ConfirmButton from '../_ConfirmButton';
import { addGalleryLink, deleteGalleryItem, setGalleryVisibility, updateGalleryItem } from './actions';
import { ExplainNote, PageHead, VisibilityBadge, VisibilitySelect, cardClass, fieldClass, labelClass, saveClass } from '../_ui';
import { fromGalleryItems } from '@/components/gallery/media';
import Frame from '@/components/gallery/Frame';
import { getOwnerCollections, getOwnerItems } from '@/lib/content';
import { requireOwner } from '@/lib/owner';

export const dynamic = 'force-dynamic';

const small = 'rounded-lg border border-line px-3 py-1.5 text-xs text-primary hover:border-muted';

export default async function AdminGalleryPage() {
  await requireOwner();
  const [collections, items] = await Promise.all([getOwnerCollections(), getOwnerItems()]);
  const galleries = collections.filter((c) => c.kind === 'carousel');
  const hidden = new Set(galleries.filter((c) => c.visibility !== 'public').map((c) => c.slug));
  const own = items.filter((i) => galleries.some((g) => g.slug === i.collection_slug)).reverse();
  const moments = fromGalleryItems(own);
  const live = own.filter((i) => i.visibility === 'public' && !hidden.has(i.collection_slug)).length;

  return (
    <div>
      <PageHead title="Gallery">
        {live > 0 && (
          <Link href="/gallery" className="text-sm underline decoration-line hover:decoration-primary">
            See it on the site &#8599;
          </Link>
        )}
      </PageHead>
      <ExplainNote>
        Your photos and videos. Public ones appear on your home page and the Gallery page; private ones only here.
        {` ${live} of ${own.length} are public now.`}
      </ExplainNote>

      <div className="mb-8 grid items-start gap-4 lg:grid-cols-2">
        <Uploader />
        <form action={addGalleryLink} className={cardClass}>
          <label>
            <span className={labelClass}>Or add a video link (YouTube or .mp4)</span>
            <input name="url" required placeholder="https://" className={fieldClass} />
          </label>
          <label>
            <span className={labelClass}>Title</span>
            <input name="title" maxLength={200} className={fieldClass} />
          </label>
          <VisibilitySelect />
          <button type="submit" className={saveClass}>Add link</button>
        </form>
      </div>

      {own.length === 0 ? (
        <p className="text-muted">Nothing yet. Upload your first photos above.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {own.map((item, i) => (
            <li key={item.id} className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-3">
              <div className="aspect-[4/3] overflow-hidden rounded-lg bg-surface-alt">
                <Frame moment={moments[i]} />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <VisibilityBadge value={hidden.has(item.collection_slug) ? 'private' : item.visibility} />
                <form action={setGalleryVisibility}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="visibility" value={item.visibility === 'public' ? 'private' : 'public'} />
                  <button type="submit" className={small}>{item.visibility === 'public' ? 'Make private' : 'Show publicly'}</button>
                </form>
              </div>
              <form action={updateGalleryItem} className="flex flex-col gap-2">
                <input type="hidden" name="id" value={item.id} />
                <input name="title" aria-label="Title" defaultValue={item.title} required maxLength={200} className={fieldClass} />
                <input name="subtitle" aria-label="Date or place" defaultValue={item.subtitle ?? ''} placeholder="Date or place" maxLength={200} className={fieldClass} />
                <button type="submit" className={`${small} self-start`}>Save</button>
              </form>
              <form action={deleteGalleryItem}>
                <input type="hidden" name="id" value={item.id} />
                <ConfirmButton question={`Delete "${item.title}"? This cannot be undone.`} className="text-xs text-muted underline hover:text-primary">
                  Delete
                </ConfirmButton>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

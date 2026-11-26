import type { Collection, CollectionItem } from '@/lib/content';
import { safeUrl, spotifyEmbedUrl } from '@/lib/safe-url';
import SafeImage from '@/components/SafeImage';
import BodyText from '@/components/BodyText';

const linkClass = 'underline decoration-line hover:decoration-primary';

const Stars = ({ rating }: { rating: number }) => (
  <span className="font-sans text-xs text-muted" aria-label={`${rating} out of 5`}>
    {'★'.repeat(rating)}
    {'☆'.repeat(5 - rating)}
  </span>
);

// Horizontal scroll-snap carousel. Pure CSS: no script, works with a swipe,
// trackpad or keyboard scroll.
const Carousel = ({ items }: { items: CollectionItem[] }) => (
  <div className="-mx-6 px-6 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3" tabIndex={0} aria-label="Carousel">
    {items.map((item) => {
      const href = safeUrl(item.url);
      const card = (
        <figure className="snap-start shrink-0 w-64">
          <div className="w-64 h-44 rounded-lg border border-line bg-surface-alt overflow-hidden flex items-center justify-center">
            <SafeImage src={safeUrl(item.image_url)} alt={item.title} width={256} height={176} className="w-full h-full object-cover" />
          </div>
          <figcaption className="mt-2 text-sm">
            <span className="text-primary">{item.title}</span>
            {item.subtitle && <span className="block font-sans text-xs text-muted">{item.subtitle}</span>}
          </figcaption>
        </figure>
      );
      return href ? (
        <a key={item.id} href={href} target="_blank" rel="noreferrer">
          {card}
        </a>
      ) : (
        <div key={item.id}>{card}</div>
      );
    })}
  </div>
);

const Item = ({ item, kind }: { item: CollectionItem; kind: Collection['kind'] }) => {
  const href = safeUrl(item.url);
  const embed = kind === 'playlists' ? spotifyEmbedUrl(item.url) : null;

  return (
    <li className="flex gap-3">
      {item.image_url && (
        <SafeImage src={safeUrl(item.image_url)} alt={item.title} width={48} height={64} className="w-12 h-16 object-cover rounded-sm shrink-0 border border-line" />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[0.95rem]">
          {href ? (
            <a href={href} target="_blank" rel="noreferrer" className={linkClass}>
              {item.title}
            </a>
          ) : (
            item.title
          )}
          {item.subtitle && <span className="text-muted"> &mdash; {item.subtitle}</span>}
        </p>
        <p className="flex gap-3 items-center mt-0.5">
          {item.status && <span className="font-sans text-xs text-muted">{item.status}</span>}
          {item.rating ? <Stars rating={item.rating} /> : null}
        </p>
        {item.notes && <BodyText text={item.notes} className="mt-2 text-sm text-secondary" />}
        {embed && (
          <iframe
            src={embed}
            title={item.title}
            loading="lazy"
            height={152}
            className="w-full mt-3 rounded-lg border-0"
            allow="encrypted-media"
          />
        )}
      </div>
    </li>
  );
};

const CollectionView = ({ collection, items }: { collection: Collection; items: CollectionItem[] }) => {
  if (items.length === 0) return <p className="text-muted">Nothing here yet.</p>;
  if (collection.kind === 'carousel') return <Carousel items={items} />;

  return (
    <ul className="space-y-5">
      {items.map((item) => (
        <Item key={item.id} item={item} kind={collection.kind} />
      ))}
    </ul>
  );
};

export default CollectionView;

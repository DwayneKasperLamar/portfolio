import type { CollectionItem } from '@/lib/content';
import { safeUrl } from '@/lib/safe-url';
import SafeImage from '@/components/SafeImage';
import StoreBadges from '@/components/StoreBadges';

// Jobs, from the public `experience` list (Admin > Collections): title = company,
// "author" = role, status = "current" or "previous", image = logo, plus optional links.
// Phone: a divided list, logo top right. Web: equal cards, logo top left, status top right.
const Experience = ({ items }: { items: CollectionItem[] }) => (
  <div className="md:grid md:grid-cols-3 md:gap-4 lg:gap-5">
    {items.map((item) => {
      const href = safeUrl(item.url);
      const logo = safeUrl(item.image_url);
      const current = item.status?.toLowerCase() === 'current';
      return (
        <article
          key={item.id}
          className="relative flex flex-col gap-2.5 border-t border-line py-[22px] first:border-t-0 first:pt-0 md:gap-3 md:rounded-2xl md:border md:bg-surface md:p-6 md:first:border-t md:first:pt-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 md:flex md:flex-col md:gap-3">
            <div>
              <h3 className="font-head text-lg font-semibold leading-snug text-primary md:text-xl">{item.subtitle}</h3>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-muted">
                {href ? (
                  <a href={href} target="_blank" rel="noreferrer" className="underline decoration-line hover:decoration-primary">
                    {item.title}
                  </a>
                ) : (
                  <span>{item.title}</span>
                )}
                {item.status && (
                  <span className="pill capitalize md:absolute md:right-6 md:top-[38px]">
                    {current && <span className="status-dot" />}
                    {item.status}
                  </span>
                )}
              </p>
            </div>
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-line bg-chip md:order-first md:h-14 md:w-14 md:rounded-[14px]">
              {logo && <SafeImage src={logo} alt={`${item.title} logo`} width={56} height={56} className="h-full w-full object-contain" />}
            </span>
          </div>
          {item.notes && <p className="text-secondary md:text-sm">{item.notes}</p>}
          <div className="md:mt-auto md:pt-1.5">
            <StoreBadges playUrl={item.play_url} name={item.title} />
          </div>
        </article>
      );
    })}
  </div>
);

export default Experience;

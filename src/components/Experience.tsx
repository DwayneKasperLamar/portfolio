import type { CollectionItem } from '@/lib/content';
import { safeUrl } from '@/lib/safe-url';
import SafeImage from '@/components/SafeImage';
import Section from '@/components/Section';
import StoreBadges from '@/components/StoreBadges';

// Jobs, from the public `experience` list (Admin > Collections): title = company,
// "author" = role, status = "current" or "previous", image = logo, plus optional links.
const Experience = ({ items }: { items: CollectionItem[] }) => {
  if (items.length === 0) return null;
  return (
    <Section title="Work experience" id="experience">
      <ul className="space-y-6">
        {items.map((item) => {
          const href = safeUrl(item.url);
          const logo = safeUrl(item.image_url);
          const current = item.status?.toLowerCase() === 'current';
          return (
            <li key={item.id} className="flex items-start gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-[0.95rem] text-primary">
                  <span className="font-semibold">{item.subtitle}</span> &middot;{' '}
                  {href ? (
                    <a href={href} target="_blank" rel="noreferrer" className="underline decoration-line hover:decoration-primary">
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </p>
                {item.status && (
                  <p className="font-mono text-xs text-muted flex items-center gap-2 mt-0.5">
                    {current && <span className="status-dot" />}
                    {item.status}
                  </p>
                )}
                {item.notes && <p className="text-sm text-secondary mt-1">{item.notes}</p>}
                <StoreBadges playUrl={item.play_url} name={item.title} />
              </div>
              {logo && (
                <span className="flex items-center justify-center w-14 h-14 md:w-11 md:h-11 shrink-0 rounded-2xl md:rounded-lg bg-chip border border-line overflow-hidden">
                  <SafeImage src={logo} alt={`${item.title} logo`} width={64} height={64} className="w-full h-full object-contain" />
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
};

export default Experience;

import type { CollectionItem } from '@/lib/content';
import { safeUrl } from '@/lib/safe-url';
import SafeImage from '@/components/SafeImage';
import Section from '@/components/Section';

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
          const play = safeUrl(item.play_url);
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
                {play && (
                  <a href={play} target="_blank" rel="noreferrer" className="hidden md:inline-block mt-1 font-mono text-xs text-muted hover:text-primary">
                    Google Play &#8599;
                  </a>
                )}
              </div>
              <div className="flex flex-col items-center gap-2 shrink-0">
                {logo && (
                  <span className="flex items-center justify-center w-16 h-16 md:w-11 md:h-11 rounded-2xl md:rounded-lg bg-chip border border-line overflow-hidden">
                    <SafeImage src={logo} alt={`${item.title} logo`} width={64} height={64} className="w-full h-full object-contain" />
                  </span>
                )}
                {play && (
                  <a
                    href={play}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${item.title} on Google Play`}
                    className="flex md:hidden items-center justify-center w-11 h-11 rounded-xl bg-chip border border-line">
                    <SafeImage src="https://cdn.simpleicons.org/googleplay" alt="Google Play" width={24} height={24} />
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
};

export default Experience;

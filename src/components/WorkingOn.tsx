import type { CollectionItem } from '@/lib/content';
import { safeUrl } from '@/lib/safe-url';

// "Working on" strip at the top of the home page. Items come from the public
// `working-on` collection (Admin > Collections). `status` shows as the small label.
const WorkingOn = ({ items }: { items: CollectionItem[] }) => {
  if (items.length === 0) return null;
  return (
    <section className="mb-10">
      <h2 className="font-mono text-xs uppercase tracking-wider text-muted mb-4 flex items-center gap-2">
        <span className="status-dot" />
        Working on now
      </h2>
      <ul className="space-y-3">
        {items.map((item) => {
          const href = safeUrl(item.url);
          return (
            <li key={item.id} className="text-[0.95rem]">
              {href ? (
                <a href={href} target="_blank" rel="noreferrer" className="underline decoration-line hover:decoration-primary text-primary">
                  {item.title}
                </a>
              ) : (
                <span className="text-primary">{item.title}</span>
              )}
              {item.status && <span className="font-mono text-xs text-muted"> &middot; {item.status}</span>}
              {item.notes && <span className="block text-sm text-secondary mt-0.5">{item.notes}</span>}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default WorkingOn;

import type { TimelineEvent } from '@/lib/content';
import { safeUrl } from '@/lib/safe-url';
import SafeImage from '@/components/SafeImage';
import BodyText from '@/components/BodyText';

// Events arrive sorted by date; a year heading appears whenever the year changes.
const TimelineList = ({ events, showVisibility }: { events: TimelineEvent[]; showVisibility?: boolean }) => {
  let lastYear = '';
  return (
    <ol className="space-y-8">
      {events.map((e) => {
        const year = e.event_date.slice(0, 4);
        const heading = year !== lastYear;
        lastYear = year;
        return (
          <li key={e.id}>
            {heading && <h2 className="label mb-3 pt-2 border-t border-line">{year}</h2>}
            <p className="font-sans text-xs text-muted mb-1">
              {e.event_date} &middot; {e.category}
              {showVisibility && ` · ${e.visibility}`}
            </p>
            <h3 className="text-[1.02rem] text-primary mb-1">{e.title}</h3>
            {e.body && <BodyText text={e.body} className="text-[0.95rem]" />}
            {e.image_url && (
              <SafeImage src={safeUrl(e.image_url)} alt={e.title} width={600} height={400} className="mt-3 rounded-lg border border-line max-w-full h-auto" />
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default TimelineList;

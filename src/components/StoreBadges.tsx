import { safeUrl } from '@/lib/safe-url';
import SafeImage from '@/components/SafeImage';

const badge = 'inline-flex items-center gap-2 rounded-lg border border-line pl-1.5 pr-3 py-1.5 text-xs';
const mark = 'flex items-center justify-center w-6 h-6 rounded-md bg-chip';

// App store availability for a job's product. Android links to its Play Store listing.
// There is no App Store listing yet, so iOS is shown as planned and is NOT a link:
// never present it as available until there is a real address.
const StoreBadges = ({ playUrl, name }: { playUrl: string | null | undefined; name: string }) => {
  const play = safeUrl(playUrl);
  if (!play) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      <a href={play} target="_blank" rel="noreferrer" aria-label={`${name} on Google Play`} className={`${badge} text-primary hover:border-muted`}>
        <span className={mark}>
          <SafeImage src="https://cdn.simpleicons.org/googleplay" alt="" width={14} height={14} />
        </span>
        Google Play
      </a>
      <span className={`${badge} text-muted border-dashed`}>
        <span className={mark}>
          <SafeImage src="https://cdn.simpleicons.org/apple" alt="" width={14} height={14} />
        </span>
        iOS planned
      </span>
    </div>
  );
};

export default StoreBadges;

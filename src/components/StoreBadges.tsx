import { safeUrl } from '@/lib/safe-url';
import SafeImage from '@/components/SafeImage';

const badge = 'inline-flex h-9 items-center gap-2 rounded-[9px] border border-line pl-1.5 pr-3 text-[13px]';
const mark = 'flex h-6 w-6 items-center justify-center rounded-md bg-chip';

// App store availability for a job's product. Android links to its Play Store listing.
// There is no App Store listing yet, so iOS is shown as planned and is NOT a link:
// never present it as available until there is a real address.
const StoreBadges = ({ playUrl, name }: { playUrl: string | null | undefined; name: string }) => {
  const play = safeUrl(playUrl);
  if (!play) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-0.5">
      <a href={play} target="_blank" rel="noreferrer" aria-label={`${name} on Google Play`} className={`${badge} text-primary hover:border-muted`}>
        <span className={mark}>
          <SafeImage src="https://cdn.simpleicons.org/googleplay" alt="" width={14} height={14} />
        </span>
        Google Play
      </a>
      <span className={`${badge} border-dashed text-muted`}>
        <span className={mark}>
          <SafeImage src="https://cdn.simpleicons.org/apple" alt="" width={14} height={14} />
        </span>
        iOS planned
      </span>
    </div>
  );
};

export default StoreBadges;

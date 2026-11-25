// One shape for anything the Story and Gallery pages show, built from timeline events or
// gallery items. All links pass through safeUrl, so only web links ever reach the page.
import type { CollectionItem, TimelineEvent } from '@/lib/content';
import { safeUrl } from '@/lib/safe-url';

export interface Moment {
  id: string;
  title: string;
  label: string; // date, place or author
  body: string;
  image: string | null; // photo, or the still shown for a video
  videoFile: string | null; // direct .mp4 / .webm link
  youtubeId: string | null;
  link: string | null; // any other web page
}

export function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\.|^m\./, '');
    let id: string | null = null;
    if (host === 'youtu.be') id = u.pathname.slice(1);
    else if (host === 'youtube.com') id = u.searchParams.get('v') ?? u.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)/)?.[1] ?? null;
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

const isVideoFile = (url: string) => /\.(mp4|webm)$/i.test(url.split(/[?#]/)[0]);

// `first` and `second` can each be a photo, a video or a web page; sort out which is which.
function sortLinks(first: string | null, second: string | null) {
  const out: Pick<Moment, 'image' | 'videoFile' | 'youtubeId' | 'link'> = { image: null, videoFile: null, youtubeId: null, link: null };
  const take = (raw: string | null, isImageField: boolean) => {
    const url = safeUrl(raw);
    if (!url) return;
    const yt = youtubeId(url);
    if (yt) out.youtubeId ??= yt;
    else if (isVideoFile(url)) out.videoFile ??= url;
    else if (isImageField) out.image ??= url;
    else out.link ??= url;
  };
  take(first, true);
  take(second, false);
  return out;
}

export const fromTimeline = (events: TimelineEvent[]): Moment[] =>
  events.map((e) => ({
    id: e.id,
    title: e.title,
    label: `${e.event_date} · ${e.category}`,
    body: e.body,
    ...sortLinks(e.image_url, null),
  }));

export const fromGalleryItems = (items: CollectionItem[]): Moment[] =>
  items.map((i) => ({
    id: i.id,
    title: i.title,
    label: i.subtitle ?? '',
    body: i.notes,
    ...sortLinks(i.image_url, i.url),
  }));

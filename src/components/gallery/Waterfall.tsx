'use client';

/* eslint-disable @next/next/no-img-element -- media links are typed in the admin; next/image needs a fixed allowlist */
import { useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Moment } from './media';

// The grid is made of thin rows; each picture takes as many as its height needs. The browser then
// puts the next picture where there is room first, which is under the shorter column.
const ROW = 4; // px, matches [grid-auto-rows:4px] below
const GAP = 8; // px between pictures

const Cell = ({ children }: { children: React.ReactNode }) => {
  const inner = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState(60);

  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    const measure = () => setRows(Math.ceil((el.offsetHeight + GAP) / ROW));
    measure();
    const watcher = new ResizeObserver(measure); // a picture changes height when it arrives
    watcher.observe(el);
    return () => watcher.disconnect();
  }, []);

  return (
    <div className="min-w-0" style={{ gridRowEnd: `span ${rows}` }}>
      <div ref={inner}>{children}</div>
    </div>
  );
};

// One picture at its own height and shape. Until it arrives, a placeholder holds its place.
const Tile = ({ moment, onOpen }: { moment: Moment; onOpen: () => void }) => {
  const [loaded, setLoaded] = useState(false);
  const [broken, setBroken] = useState(false);
  const still = moment.image ?? (moment.youtubeId ? `https://i.ytimg.com/vi/${moment.youtubeId}/hqdefault.jpg` : null);
  const isVideo = Boolean(moment.videoFile || moment.youtubeId);
  const youtubeStill = !moment.image && Boolean(moment.youtubeId); // always shown wide, without its black bars

  return (
    <button type="button" aria-label={`Open ${moment.title}`} onClick={onOpen} className="relative block w-full overflow-hidden rounded-2xl bg-surface-alt">
      {moment.videoFile ? (
        <video src={`${moment.videoFile}#t=0.1`} poster={moment.image ?? undefined} muted playsInline preload="metadata"
          onLoadedMetadata={() => setLoaded(true)} className={`pointer-events-none block h-auto w-full ${loaded ? '' : 'aspect-[4/5]'}`} />
      ) : still && !broken ? (
        <img src={still} alt={moment.title} loading="lazy" draggable={false} onLoad={() => setLoaded(true)} onError={() => setBroken(true)}
          className={`block w-full ${youtubeStill ? 'aspect-video object-cover' : loaded ? 'h-auto' : 'aspect-[4/5] object-cover'}`} />
      ) : (
        <span className="grid min-h-[130px] content-center gap-2 p-4 text-center">
          <span className="text-xs text-muted">{moment.label}</span>
          <span className="leading-snug text-primary">{moment.title}</span>
        </span>
      )}
      {isVideo && <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-veil px-2 py-0.5 text-[0.65rem] text-on-veil">&#9654; video</span>}
    </button>
  );
};

// The phone gallery: two columns, like Pinterest.
const Waterfall = ({ moments, limit, onOpen }: { moments: Moment[]; limit?: number; onOpen: (index: number) => void }) => {
  const shown = limit ? moments.slice(0, limit) : moments;
  return (
    <>
      <div className="grid grid-cols-2 items-start gap-x-2 [grid-auto-rows:4px]">
        {shown.map((m, i) => (
          <Cell key={m.id}>
            <Tile moment={m} onOpen={() => onOpen(i)} />
          </Cell>
        ))}
      </div>
      {shown.length < moments.length && (
        <Link href="/gallery" className="btn mt-2 w-full">
          See all {moments.length}
        </Link>
      )}
    </>
  );
};

export default Waterfall;

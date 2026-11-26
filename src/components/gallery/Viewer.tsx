'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from 'react';
import { safeUrl } from '@/lib/safe-url';
import type { Moment } from './media';

interface ViewerProps {
  moments: Moment[];
  index: number | null;
  onChange: (index: number | null) => void;
}

const button = 'font-sans text-xs border border-on-veil rounded-md px-4 py-2 text-on-veil';

// Full-screen view of one moment. Escape closes, arrow keys move.
const Viewer = ({ moments, index, onChange }: ViewerProps) => {
  const dialog = useRef<HTMLDivElement>(null);
  const open = index !== null;

  // Remember where focus was, lock the page behind, and put both back on close.
  useEffect(() => {
    if (!open) return;
    const before = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      before?.focus({ preventScroll: true });
    };
  }, [open]);

  if (index === null || !moments[index]) return null;
  const m = moments[index];
  const move = (by: number) => onChange((index + by + moments.length) % moments.length);
  const link = safeUrl(m.link);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onChange(null);
    if (e.key === 'ArrowLeft') move(-1);
    if (e.key === 'ArrowRight') move(1);
    if (e.key === 'Tab') {
      // keep the keyboard inside the viewer
      const items = Array.from(dialog.current?.querySelectorAll<HTMLElement>('button, a[href], video, iframe') ?? []);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={m.title}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      onClick={(e) => e.target === e.currentTarget && onChange(null)}
      className="fixed inset-0 z-50 bg-veil text-on-veil flex flex-col items-center justify-center gap-4 p-4 overflow-y-auto outline-none">
      {m.youtubeId ? (
        <iframe
          key={m.id}
          src={`https://www.youtube-nocookie.com/embed/${m.youtubeId}?autoplay=1&rel=0`}
          title={m.title}
          allow="autoplay; encrypted-media; fullscreen"
          className="w-full max-w-[960px] aspect-video rounded-lg border-0 shrink-0"
        />
      ) : m.videoFile ? (
        <video key={m.id} src={m.videoFile} poster={m.image ?? undefined} controls autoPlay playsInline className="w-full max-w-[960px] max-h-[65vh] rounded-lg shrink-0" />
      ) : m.image ? (
        <img key={m.id} src={m.image} alt={m.title} className="max-w-full max-h-[65vh] object-contain rounded-lg shrink-0" />
      ) : null}

      <div className="text-center max-w-[560px]">
        <p className="font-sans text-xs opacity-80">
          {index + 1} of {moments.length}
          {m.label && ` · ${m.label}`}
        </p>
        <h2 className="text-lg font-semibold mt-1">{m.title}</h2>
        {m.body && <p className="text-sm mt-2 whitespace-pre-line opacity-90 max-h-[30vh] overflow-y-auto">{m.body}</p>}
        {link && (
          <a href={link} target="_blank" rel="noreferrer" className="inline-block text-sm underline mt-2">
            Open link &#8599;
          </a>
        )}
      </div>

      <div className="flex gap-2">
        <button type="button" className={button} onClick={() => move(-1)}>
          Previous
        </button>
        <button type="button" className={button} onClick={() => onChange(null)}>
          Close
        </button>
        <button type="button" className={button} onClick={() => move(1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Viewer;

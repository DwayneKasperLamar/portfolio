'use client';

import { useEffect, useRef } from 'react';
import Frame from './Frame';
import type { Moment } from './media';

const TOP = 16; // where a card comes to rest, in pixels from the top of the screen

// Phone layout for the Story page: ordinary scrolling. Each moment fills the screen and the
// next one slides over it while the last sinks back.
const StackedMoments = ({ moments, onOpen }: { moments: Moment[]; onOpen: (index: number) => void }) => {
  const slots = useRef<(HTMLDivElement | null)[]>([]);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const settle = () => {
      cards.current.forEach((card, i) => {
        const next = slots.current[i + 1];
        if (!card) return;
        // 0 while the next card is still below, 1 once it has fully covered this one.
        const gone = next ? Math.max(0, Math.min(1, 1 - (next.getBoundingClientRect().top - TOP) / next.offsetHeight)) : 0;
        card.style.transform = still ? '' : `scale(${1 - gone * 0.12})`;
        card.style.opacity = String(1 - gone * 0.6);
      });
    };
    settle();
    window.addEventListener('scroll', settle, { passive: true });
    window.addEventListener('resize', settle);
    return () => {
      window.removeEventListener('scroll', settle);
      window.removeEventListener('resize', settle);
    };
  }, [moments]);

  return (
    <div className="-mx-3">
      {moments.map((m, i) => (
        <div
          key={m.id}
          ref={(el) => {
            slots.current[i] = el;
          }}
          style={{ top: TOP }}
          className="sticky h-[78vh] pb-3">
          <button
            type="button"
            ref={(el) => {
              cards.current[i] = el;
            }}
            onClick={() => onOpen(i)}
            className="relative block w-full h-full overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl origin-top text-left">
            <Frame moment={m} bare />
            <span className="absolute inset-x-0 bottom-0 block px-5 pt-14 pb-5 pr-10 bg-gradient-to-t from-veil to-transparent text-on-veil">
              <span className="block font-sans text-xs opacity-85">
                {m.label} &middot; {i + 1} of {moments.length}
              </span>
              <span className="block text-lg font-semibold leading-snug">{m.title}</span>
            </span>
            {moments.length <= 20 && (
              <span aria-hidden className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                {moments.map((other, j) => (
                  <span key={other.id} className={`w-[3px] rounded-sm bg-on-veil ${i === j ? 'h-6' : 'h-3 opacity-40'}`} />
                ))}
              </span>
            )}
          </button>
        </div>
      ))}
    </div>
  );
};

export default StackedMoments;

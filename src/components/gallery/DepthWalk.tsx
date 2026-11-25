'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Frame from './Frame';
import type { Moment } from './media';

const GAP = 520; // distance between two moments, in pixels of depth

// Repeatable "random" number per frame, so the scatter is the same on every visit.
const scatter = (n: number) => {
  const x = Math.sin(n * 91.7) * 43758.5;
  return x - Math.floor(x);
};

// Web layout for the Story page: walk forward through time, each moment comes toward you.
const DepthWalk = ({ moments, onOpen }: { moments: Moment[]; onOpen: (index: number) => void }) => {
  const stage = useRef<HTMLDivElement>(null);
  const planes = useRef<(HTMLDivElement | null)[]>([]);
  const position = useRef(0);
  const drag = useRef<{ y: number; moved: boolean } | null>(null);
  const [at, setAt] = useState(0);
  const [slider, setSlider] = useState(0);
  const max = Math.max(0, (moments.length - 1) * GAP);

  const walk = useCallback(
    (to: number) => {
      const pos = Math.max(0, Math.min(max, to));
      position.current = pos;
      const spread = Math.min(1, (stage.current?.clientWidth ?? 900) / 900);
      planes.current.forEach((plane, i) => {
        if (!plane) return;
        const z = pos - i * GAP;
        const near = Math.max(0, Math.min(1, (z + GAP) / GAP)); // frames drift to the centre as they arrive
        const side = (i % 2 ? 1 : -1) * (300 + scatter(i) * 120) * spread * (1 - near * 0.85);
        const up = (scatter(i + 3) - 0.5) * 260 * (1 - near * 0.85);
        const opacity = z > 0 ? 1 - z / 260 : 1 + z / (GAP * 4.2);
        plane.style.opacity = String(Math.max(0, Math.min(1, opacity)));
        plane.style.visibility = opacity <= 0 ? 'hidden' : 'visible';
        plane.style.zIndex = String(1000 - Math.round(Math.abs(z) / 10));
        plane.style.transform = `translate(-50%,-50%) translate3d(${side}px,${up}px,${z}px)`;
      });
      setAt(Math.round(pos / GAP));
      setSlider(max ? Math.round((pos / max) * 1000) : 0);
    },
    [max],
  );

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    // At either end, let the wheel scroll the page as usual.
    const onWheel = (e: WheelEvent) => {
      const next = position.current + e.deltaY * 1.4;
      if ((next < 0 && position.current === 0) || (next > max && position.current === max)) return;
      e.preventDefault();
      walk(next);
    };
    const onResize = () => walk(position.current);
    walk(position.current);
    el.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', onResize);
    return () => {
      el.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
    };
  }, [walk, max]);

  const step = (by: number) => walk((Math.round(position.current / GAP) + by) * GAP);
  const front = moments[at] ?? moments[0];

  return (
    <div>
      <div
        ref={stage}
        tabIndex={0}
        aria-label="Story walk. Scroll, drag or use the arrow keys. Press Enter to open."
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            step(1);
          }
          if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            step(-1);
          }
          if (e.key === 'Enter') onOpen(at);
        }}
        onPointerDown={(e) => {
          drag.current = { y: e.clientY, moved: false };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          const by = d.y - e.clientY;
          if (Math.abs(by) > 2) {
            d.moved = true;
            d.y = e.clientY;
            walk(position.current + by * 4);
          }
        }}
        onPointerUp={() => {
          if (drag.current && !drag.current.moved) onOpen(Math.round(position.current / GAP));
          drag.current = null;
        }}
        onPointerCancel={() => (drag.current = null)}
        className="relative h-[540px] overflow-hidden rounded-xl border border-line bg-stage [perspective:900px] touch-none cursor-ns-resize select-none">
        {moments.map((m, i) => (
          <div
            key={m.id}
            ref={(el) => {
              planes.current[i] = el;
            }}
            className="absolute left-1/2 top-1/2 w-[min(420px,70%)] aspect-[3/2] overflow-hidden rounded-md border border-line bg-surface shadow-2xl invisible">
            <Frame moment={m} playing={i === at} />
          </div>
        ))}
        <p className="absolute left-4 bottom-3 max-w-[calc(100%-2rem)] z-[2000] bg-base border border-line rounded-md px-3 py-1.5 font-mono text-xs">
          {front.label} &middot; {front.title}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3 mt-3">
        <input
          type="range"
          min={0}
          max={1000}
          value={slider}
          disabled={max === 0}
          onChange={(e) => walk((Number(e.target.value) / 1000) * max)}
          aria-label="Position in the story"
          className="flex-1 min-w-[160px] accent-current"
        />
        <button type="button" onClick={() => onOpen(at)} className="font-mono text-xs border border-line rounded-md px-4 py-2 text-muted hover:text-primary">
          Open this one
        </button>
      </div>
    </div>
  );
};

export default DepthWalk;

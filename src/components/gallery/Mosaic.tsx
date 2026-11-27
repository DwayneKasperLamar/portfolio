'use client';

import { useRef, useState } from 'react';
import Frame from './Frame';
import type { Moment } from './media';

function chunk<T>(list: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  // Never leave one frame alone: it would stretch across the whole row.
  if (out.length > 1 && out[out.length - 1].length === 1) out[out.length - 1].unshift(out[out.length - 2].pop() as T);
  return out;
}

// The web gallery: the frame you point at swells and its neighbours make room; a second click
// opens it full screen. Phones use Waterfall instead.
const Mosaic = ({ moments, onOpen }: { moments: Moment[]; onOpen: (index: number) => void }) => {
  const [grown, setGrown] = useState(0);
  const wasGrown = useRef(false);
  const rows = chunk(moments, 4);
  const grownRow = Math.max(0, rows.findIndex((row) => row.includes(moments[grown])));

  return (
    <div className="flex flex-col gap-1.5" style={{ height: Math.max(420, rows.length * 170) }}>
      {rows.map((row, r) => (
        <div
          key={row[0].id}
          className={`flex gap-1.5 min-h-0 transition-all duration-500 motion-reduce:transition-none ${r === grownRow ? 'flex-[2.6_1_0%]' : 'flex-[1_1_0%]'}`}>
          {row.map((m, c) => {
            const i = rows.slice(0, r).reduce((total, previous) => total + previous.length, 0) + c;
            const isGrown = i === grown;
            const size = isGrown ? 'flex-[3.8_1_0%]' : 'flex-[1_1_0%]';
            return (
              <button
                key={m.id}
                type="button"
                aria-label={isGrown ? `Open ${m.title}` : m.title}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setGrown(i)}
                onPointerDown={() => (wasGrown.current = isGrown)}
                onFocus={() => setGrown(i)}
                onClick={(e) => {
                  // detail 0 = keyboard: open straight away.
                  if (wasGrown.current || e.detail === 0) onOpen(i);
                  else setGrown(i);
                  wasGrown.current = false;
                }}
                className={`relative min-w-0 overflow-hidden rounded-lg bg-surface transition-all duration-500 motion-reduce:transition-none ${size}`}>
                <Frame moment={m} playing={isGrown} bare={isGrown} />
                {isGrown && (
                  <span className="absolute inset-x-0 bottom-0 block px-3 pt-8 pb-2 bg-gradient-to-t from-veil to-transparent text-on-veil font-sans text-xs text-left truncate">
                    {m.title}
                    {m.label && ` · ${m.label}`}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Mosaic;

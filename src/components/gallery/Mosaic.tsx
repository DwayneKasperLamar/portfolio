'use client';

import { useRef, useState } from 'react';
import Frame from './Frame';
import type { Moment } from './media';

function chunk<T>(list: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  // On the web, never leave one frame alone: it would stretch across the whole row.
  if (size > 2 && out.length > 1 && out[out.length - 1].length === 1) out[out.length - 1].unshift(out[out.length - 2].pop() as T);
  return out;
}

// Gallery page. Web: the frame you point at swells and its neighbours make room.
// Phone: two to a row; tap one to open it wide while its partner folds to a strip.
// In both, a second click or tap opens it full screen.
const Mosaic = ({ moments, phone, onOpen }: { moments: Moment[]; phone: boolean; onOpen: (index: number) => void }) => {
  const [grown, setGrown] = useState(0);
  const wasGrown = useRef(false);
  const perRow = phone ? 2 : 4;
  const rows = chunk(moments, perRow);
  const grownRow = Math.max(0, rows.findIndex((row) => row.includes(moments[grown])));

  return (
    <div className="flex flex-col gap-1.5" style={phone ? undefined : { height: Math.max(420, rows.length * 170) }}>
      {rows.map((row, r) => (
        <div
          key={row[0].id}
          className={`flex gap-1.5 min-h-0 transition-all duration-500 motion-reduce:transition-none ${
            phone ? (r === grownRow ? 'h-[300px]' : 'h-32') : r === grownRow ? 'flex-[2.6_1_0%]' : 'flex-[1_1_0%]'
          }`}>
          {row.map((m, c) => {
            const i = rows.slice(0, r).reduce((total, previous) => total + previous.length, 0) + c;
            const isGrown = i === grown;
            const size = isGrown
              ? phone
                ? 'flex-[1_1_0%]'
                : 'flex-[3.8_1_0%]'
              : phone && r === grownRow
                ? 'flex-[0_0_46px]'
                : 'flex-[1_1_0%]';
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

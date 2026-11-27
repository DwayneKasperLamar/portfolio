'use client';

import { useEffect, useMemo, useState } from 'react';
import { chip, chipOff, chipOn } from './form-styles';
import type { Slot } from '@/lib/booking';

// Pick a day, then a time. Both are shown in the visitor's own time zone.
export default function SlotPicker({ slots, value, onPick }: { slots: Slot[]; value: string; onPick: (start: string) => void }) {
  const [mounted, setMounted] = useState(false);
  const [day, setDay] = useState('');
  useEffect(() => setMounted(true), []);

  const days = useMemo(() => {
    const grouped = new Map<string, Slot[]>();
    for (const s of slots) {
      const key = new Date(s.start).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
      grouped.set(key, [...(grouped.get(key) ?? []), s]);
    }
    return grouped;
  }, [slots]);

  if (!mounted) return <div className="h-48 rounded-xl bg-surface" aria-hidden />;
  if (slots.length === 0) return <p className="text-sm text-muted">No free times in the coming weeks. Please email me.</p>;

  const activeDay = days.has(day) ? day : [...days.keys()][0];
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {[...days.keys()].map((d) => (
          <button key={d} type="button" data-day aria-pressed={d === activeDay} onClick={() => { setDay(d); onPick(''); }}
            className={`${chip} whitespace-nowrap !px-1.5 ${d === activeDay ? chipOn : chipOff}`}>
            {d}
          </button>
        ))}
      </div>
      <div>
        <p className="mb-2 text-xs text-muted">Start time, in your time zone: {zone}</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {days.get(activeDay)!.map((s) => (
            <button key={s.start} type="button" data-time={s.start} aria-pressed={s.start === value} onClick={() => onPick(s.start)}
              className={`${chip} ${s.start === value ? chipOn : chipOff}`}>
              {new Date(s.start).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

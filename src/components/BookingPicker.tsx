'use client';

import { useEffect, useMemo, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { createBooking, type BookingState } from '../../app/actions/booking';
import { usd, type Slot } from '@/lib/booking';

const chip = 'rounded-[10px] border px-3 py-2.5 text-center text-[13px]';
const on = 'border-primary bg-primary text-inverse';
const off = 'border-line text-primary hover:border-muted';

function Confirm({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={disabled || pending} className="btn btn-fill disabled:opacity-50">
      {pending ? 'Booking…' : 'Confirm booking'}
    </button>
  );
}

// Pick a day, a time and a length. Days and times are shown in the visitor's own time zone.
export default function BookingPicker({ token, slots, rate }: { token: string; slots: Slot[]; rate: number }) {
  const [state, action] = useFormState<BookingState, FormData>(createBooking, { status: 'idle' });
  const [mounted, setMounted] = useState(false);
  const [day, setDay] = useState('');
  const [start, setStart] = useState('');
  const [hours, setHours] = useState(1);
  useEffect(() => setMounted(true), []);

  const days = useMemo(() => {
    const grouped = new Map<string, Slot[]>();
    for (const s of slots) {
      const key = new Date(s.start).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
      grouped.set(key, [...(grouped.get(key) ?? []), s]);
    }
    return grouped;
  }, [slots]);

  if (!mounted) return <div className="h-64 rounded-2xl border border-line" aria-hidden />;
  if (slots.length === 0) return <p>No free times in the coming weeks. I will email you some.</p>;

  const activeDay = days.has(day) ? day : [...days.keys()][0];
  const chosen = slots.find((s) => s.start === start);
  const length = chosen ? Math.min(hours, chosen.maxHours) : 1;
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <form action={action} className="grid gap-5 rounded-2xl border border-line p-[18px] md:p-6">
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="start" value={chosen?.start ?? ''} />
      <input type="hidden" name="hours" value={length} />

      <div>
        <h2 className="mb-2.5 font-head text-xl font-semibold text-primary">1 · Pick a day</h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {[...days.keys()].map((d) => (
            <button key={d} type="button" aria-pressed={d === activeDay} onClick={() => { setDay(d); setStart(''); }} className={`${chip} whitespace-nowrap !px-1.5 ${d === activeDay ? on : off}`}>
              {d}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h2 className="mb-1 font-head text-xl font-semibold text-primary">2 · Pick a time</h2>
        <p className="mb-2.5 text-xs text-muted">Your time zone: {zone}</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {days.get(activeDay)!.map((s) => (
            <button key={s.start} type="button" aria-pressed={s.start === start} onClick={() => setStart(s.start)} className={`${chip} ${s.start === start ? on : off}`}>
              {new Date(s.start).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h2 className="mb-2.5 font-head text-xl font-semibold text-primary">3 · How long?</h2>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: chosen?.maxHours ?? 1 }, (_, i) => i + 1).map((n) => (
            <button key={n} type="button" aria-pressed={n === length} onClick={() => setHours(n)} className={`${chip} ${n === length ? on : off}`}>
              {n} {n === 1 ? 'hour' : 'hours'}
            </button>
          ))}
        </div>
      </div>

      {state.status === 'error' && (
        <p role="alert" className="rounded-[10px] border border-line bg-surface-alt px-3 py-2 text-[13px] font-medium text-primary">{state.message}</p>
      )}
      {state.status === 'booked' && (
        <p role="status" className="rounded-[10px] border border-line bg-surface-alt px-3 py-2 text-[13px] font-medium text-primary">
          Booked. Your session and how to pay are listed above.
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <p>
          <span className="label block">Total</span>
          <b className="text-lg text-primary">{usd(rate * length)}</b>{' '}
          <span className="text-sm text-muted">({length} × {usd(rate)})</span>
        </p>
        <Confirm disabled={!chosen} />
      </div>
    </form>
  );
}

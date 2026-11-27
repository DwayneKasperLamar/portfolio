'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { alertBox, chip, chipOff, chipOn, formCard } from './form-styles';
import { claimPayment, type BookingState } from '../../app/actions/booking';
import { usd } from '@/lib/booking';

function Paid() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn w-full disabled:opacity-50">
      {pending ? 'Sending…' : 'I have paid'}
    </button>
  );
}

interface Props {
  token: string;
  rate: number;
  maxHours: number;
  link: string | null;
  note: string | null;
}

// Step one for an accepted client: choose how long, pay, and say so.
export default function PayCard({ token, rate, maxHours, link, note }: Props) {
  const [state, action] = useFormState<BookingState, FormData>(claimPayment, { status: 'idle' });
  const [hours, setHours] = useState(1);

  return (
    <form action={action} className={formCard}>
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="hours" value={hours} />
      <h2 className="font-head text-xl font-semibold text-primary">How long?</h2>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {Array.from({ length: maxHours }, (_, i) => i + 1).map((n) => (
          <button key={n} type="button" aria-pressed={n === hours} onClick={() => setHours(n)} className={`${chip} ${n === hours ? chipOn : chipOff}`}>
            {n} {n === 1 ? 'hour' : 'hours'}
          </button>
        ))}
      </div>
      <p className="rounded-xl border border-line bg-surface p-4">
        <span className="label block">Total in US dollars</span>
        <b className="text-[22px] text-primary">{usd(rate * hours)}</b> <span className="text-sm text-muted">({hours} × {usd(rate)})</span>
      </p>
      {note && <p className="whitespace-pre-line text-sm text-secondary">{note}</p>}
      {link ? (
        <a href={link} target="_blank" rel="noreferrer" className="btn btn-fill w-full">
          Pay now
        </a>
      ) : (
        !note && <p className="text-sm text-muted">I will email you how to pay.</p>
      )}
      {state.status === 'error' && <p role="alert" className={alertBox}>{state.message}</p>}
      <Paid />
      <p className="text-[12.5px] text-muted">
        Pay first, then press &ldquo;I have paid&rdquo;. Once I see the money, this page lets you pick your time, from the next day on.
      </p>
    </form>
  );
}

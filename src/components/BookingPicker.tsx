'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import SlotPicker from './SlotPicker';
import { alertBox, formCard } from './form-styles';
import { bookSession, type BookingState } from '../../app/actions/booking';
import type { Slot } from '@/lib/booking';

function Confirm({ disabled, hours }: { disabled: boolean; hours: number }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={disabled || pending} className="btn btn-fill w-full disabled:opacity-50">
      {pending ? 'Booking…' : `Book my ${hours} ${hours === 1 ? 'hour' : 'hours'}`}
    </button>
  );
}

// For a confirmed payment: pick when it happens. The length is what was paid for.
export default function BookingPicker({ token, paymentId, hours, slots }: { token: string; paymentId: string; hours: number; slots: Slot[] }) {
  const [state, action] = useFormState<BookingState, FormData>(bookSession, { status: 'idle' });
  const [start, setStart] = useState('');
  const chosen = slots.some((s) => s.start === start) ? start : '';

  return (
    <form action={action} className={formCard}>
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="payment" value={paymentId} />
      <input type="hidden" name="start" value={chosen} />
      <h2 className="font-head text-xl font-semibold text-primary">When suits you?</h2>
      <SlotPicker slots={slots} value={chosen} onPick={setStart} />
      {state.status === 'error' && <p role="alert" className={alertBox}>{state.message}</p>}
      <Confirm disabled={!chosen} hours={hours} />
    </form>
  );
}

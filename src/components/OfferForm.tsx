'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import SlotPicker from './SlotPicker';
import { alertBox, field, formCard, label } from './form-styles';
import { sendOffer, type EnquiryState } from '../../app/actions/enquiry';
import { ENQUIRY_LIMITS as L, REPLY_HOURS, type Slot } from '@/lib/booking';

function Send({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={disabled || pending} className="btn btn-fill w-full disabled:opacity-60">
      {pending ? 'Sending…' : 'Request this call'}
    </button>
  );
}

const empty = { name: '', email: '', company: '', job_role: '', country: '', city: '', description: '', pay_range: '' };

// For recruiters and job offers: who they are, the role, and a time for a free call.
export default function OfferForm({ slots }: { slots: Slot[] }) {
  const [state, action] = useFormState<EnquiryState, FormData>(sendOffer, { status: 'idle' });
  // Typed answers are kept here so a refused send never wipes them.
  const [values, setValues] = useState(empty);
  const [start, setStart] = useState('');
  const chosen = slots.some((s) => s.start === start) ? start : '';
  const bind = (key: keyof typeof empty) => ({
    name: key,
    value: values[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValues((v) => ({ ...v, [key]: e.target.value })),
  });
  const text = (key: 'name' | 'company' | 'job_role' | 'country' | 'city', title: string, auto?: string, hint?: string) => (
    <label className={label}>
      {title}
      <input {...bind(key)} required maxLength={L[key]} autoComplete={auto} placeholder={hint} className={field} />
    </label>
  );

  if (state.status === 'sent') {
    return (
      <div role="status" className="rounded-2xl border border-line bg-surface p-6">
        <h2 className="font-head text-2xl font-semibold text-primary">Request sent. Thank you.</h2>
        <p className="mt-2 text-secondary">
          Your time is held. I reply within {REPLY_HOURS} hours, by email, to confirm it and send the call link.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className={`relative ${formCard}`}>
      <input type="hidden" name="start" value={chosen} />
      <h2 className="font-head text-xl font-semibold text-primary">About you</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {text('name', 'Your name', 'name')}
        <label className={label}>
          Work email
          <input {...bind('email')} type="email" required maxLength={L.email} autoComplete="email" className={field} />
        </label>
        {text('company', 'Company', 'organization')}
        {text('job_role', 'Your role', 'organization-title', 'Recruiter, founder, CTO…')}
        {text('country', 'Country', 'country-name')}
        {text('city', 'City', 'address-level2')}
      </div>
      <label className={label}>
        The role or offer (at least {L.descriptionMin} characters)
        <textarea {...bind('description')} required rows={5} minLength={L.descriptionMin} maxLength={L.descriptionMax}
          placeholder="The job, the team, what you need the person to do, and how it works day to day." className={field} />
        <span className="font-normal">{values.description.trim().length} of {L.descriptionMin}</span>
      </label>
      <label className={label}>
        Pay range (optional)
        <input {...bind('pay_range')} maxLength={L.pay_range} className={field} />
      </label>

      <h2 className="mt-1 font-head text-xl font-semibold text-primary">Pick a day and time</h2>
      <SlotPicker slots={slots} value={chosen} onPick={setStart} />

      {/* Trap for robots: kept off screen and out of the tab order. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {state.status === 'error' && <p role="alert" className={alertBox}>{state.message}</p>}
      <Send disabled={!chosen} />
      <p className="text-[12.5px] text-muted">Free. I use these details only to answer you.</p>
    </form>
  );
}

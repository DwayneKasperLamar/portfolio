'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { sendEnquiry, type EnquiryState } from '../../app/actions/enquiry';
import { BUDGETS, ENQUIRY_LIMITS as L, NEEDS, STARTS } from '@/lib/booking';

const field = 'w-full rounded-[10px] border border-line bg-surface px-3.5 py-2.5 text-[15px] text-primary placeholder:text-muted';
const label = 'grid gap-1.5 text-[12.5px] font-medium text-muted';

function SendButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-fill w-full disabled:opacity-60">
      {pending ? 'Sending…' : 'Send enquiry'}
    </button>
  );
}

const empty = { name: '', email: '', company: '', job_role: '', country: '', city: '', need: '', description: '', budget: '', start_when: '' };

export default function EnquiryForm() {
  const [state, action] = useFormState<EnquiryState, FormData>(sendEnquiry, { status: 'idle' });
  // Typed answers are kept here so a refused send never wipes them.
  const [values, setValues] = useState(empty);
  const bind = (key: keyof typeof empty) => ({
    name: key,
    required: true,
    value: values[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value })),
  });
  const text = (key: 'name' | 'company' | 'job_role' | 'country' | 'city', title: string, auto?: string, hint?: string) => (
    <label className={label}>
      {title}
      <input {...bind(key)} maxLength={L[key]} autoComplete={auto} placeholder={hint} className={field} />
    </label>
  );

  if (state.status === 'sent') {
    return (
      <div role="status" className="rounded-2xl border border-line bg-surface p-6">
        <h2 className="font-head text-2xl font-semibold text-primary">Enquiry sent. Thank you.</h2>
        <p className="mt-2 text-secondary">I read every one. If it is a fit, I will email you a link to book a session.</p>
      </div>
    );
  }

  return (
    <form action={action} className="relative grid gap-4 rounded-2xl border border-line p-[18px] md:p-6">
      <h2 className="font-head text-xl font-semibold text-primary">About you</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {text('name', 'Your name', 'name')}
        <label className={label}>
          Work email
          <input {...bind('email')} type="email" maxLength={L.email} autoComplete="email" className={field} />
        </label>
        {text('company', 'Company or project', 'organization')}
        {text('job_role', 'Your role', 'organization-title', 'Founder, CTO, recruiter…')}
        {text('country', 'Country', 'country-name')}
        {text('city', 'City', 'address-level2')}
      </div>

      <fieldset className="mt-1">
        <legend className="mb-2.5 font-head text-xl font-semibold text-primary">What you need</legend>
        <div className="flex flex-wrap gap-2">
          {NEEDS.map((n) => (
            <label
              key={n}
              className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] focus-within:ring-2 ${
                values.need === n ? 'border-primary bg-primary text-inverse' : 'border-line text-primary'
              }`}>
              <input type="radio" name="need" value={n} required checked={values.need === n} onChange={() => setValues((v) => ({ ...v, need: n }))} className="sr-only" />
              {n}
            </label>
          ))}
        </div>
      </fieldset>

      <label className={label}>
        Describe it (at least {L.descriptionMin} characters)
        <textarea {...bind('description')} rows={6} minLength={L.descriptionMin} maxLength={L.descriptionMax}
          placeholder="What are you building, what is not working today, and what would success look like?" className={field} />
        <span className="font-normal">
          {values.description.trim().length} of {L.descriptionMin}
        </span>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        {(
          [
            ['budget', 'Budget', BUDGETS],
            ['start_when', 'When do you want to start?', STARTS],
          ] as const
        ).map(([key, title, options]) => (
          <label key={key} className={label}>
            {title}
            <select {...bind(key)} className={field}>
              <option value="">Choose</option>
              {options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
        ))}
      </div>

      {/* Trap for robots: kept off screen and out of the tab order. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {state.status === 'error' && (
        <p role="alert" className="rounded-[10px] border border-line bg-surface-alt px-3 py-2 text-[13px] font-medium text-primary">
          {state.message}
        </p>
      )}
      <SendButton />
      <p className="text-[12.5px] text-muted">I use these details only to answer you.</p>
    </form>
  );
}

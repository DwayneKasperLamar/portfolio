'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { sendMessage, type SendState } from '../../app/actions/contact';

const field = 'w-full rounded-[10px] border border-line bg-surface px-3.5 py-2.5 text-[15px] text-primary placeholder:text-muted';
const label = 'grid gap-1.5 text-[12.5px] font-medium text-muted';
const card = 'rounded-2xl border border-line bg-base p-[18px] text-primary md:p-6';

function SendButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-fill w-full disabled:opacity-60">
      {pending ? 'Sending…' : 'Send message'}
    </button>
  );
}

function Form({ onAgain }: { onAgain: () => void }) {
  const [state, action] = useFormState<SendState, FormData>(sendMessage, { status: 'idle' });
  // Typed text is kept here so a failed send never wipes it.
  const [values, setValues] = useState({ name: '', email: '', body: '' });
  const bind = (key: keyof typeof values) => ({
    name: key,
    value: values[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValues((v) => ({ ...v, [key]: e.target.value })),
  });

  if (state.status === 'sent') {
    return (
      <div role="status" className={`${card} grid min-h-[300px] content-center justify-items-start gap-3`}>
        <h3 className="font-head text-xl font-semibold">Message sent. Thank you.</h3>
        <p className="text-secondary">I will reply to you by email.</p>
        <button type="button" onClick={onAgain} className="btn">
          Send another
        </button>
      </div>
    );
  }

  return (
    <form action={action} className={`${card} grid gap-3.5`}>
      <h3 className="font-head text-xl font-semibold">Send me a message</h3>
      <label className={label}>
        Your name
        <input {...bind('name')} required maxLength={100} autoComplete="name" placeholder="Name" className={field} />
      </label>
      <label className={label}>
        Your email
        <input {...bind('email')} type="email" required maxLength={200} autoComplete="email" placeholder="you@company.com" className={field} />
      </label>
      <label className={label}>
        What are you building?
        <textarea {...bind('body')} required maxLength={3000} rows={4} placeholder="A few lines is enough" className={field} />
      </label>
      {/* Trap for robots: kept off screen and out of the tab order. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {state.status === 'error' && (
        <p role="alert" className="rounded-[10px] border border-line bg-surface-alt px-3 py-2 text-[13px] font-medium">
          {state.message}
        </p>
      )}
      <SendButton />
      <p className="text-[12.5px] text-muted">I use your name and email only to reply to you.</p>
    </form>
  );
}

// "Send another" starts a completely fresh form.
export default function MessageForm() {
  const [round, setRound] = useState(0);
  return (
    <div className="relative">
      <Form key={round} onAgain={() => setRound((r) => r + 1)} />
    </div>
  );
}

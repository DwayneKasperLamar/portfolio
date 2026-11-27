'use client';

// A submit button that asks before doing something that cannot be undone.
export default function ConfirmButton({ question, className, children }: { question: string; className?: string; children: React.ReactNode }) {
  return (
    <button type="submit" className={className} onClick={(e) => { if (!window.confirm(question)) e.preventDefault(); }}>
      {children}
    </button>
  );
}

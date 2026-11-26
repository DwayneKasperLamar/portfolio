'use client';

export default function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="print:hidden font-sans text-xs border border-line rounded-md px-4 py-2 text-muted hover:text-primary">
      Print or save as PDF
    </button>
  );
}

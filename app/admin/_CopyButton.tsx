'use client';

import { useState } from 'react';
import { btnClass } from './_ui';

export default function CopyButton({ text, label }: { text: string; label: string }) {
  const [state, setState] = useState(label);
  return (
    <button
      type="button"
      className={btnClass}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setState('Copied');
        } catch {
          setState('Select the link and copy it');
        }
        setTimeout(() => setState(label), 3000);
      }}>
      {state}
    </button>
  );
}

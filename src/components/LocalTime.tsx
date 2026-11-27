'use client';

import { useEffect, useState } from 'react';

// A moment written in the visitor's own time zone (the server does not know it).
export default function LocalTime({ iso }: { iso: string }) {
  const [text, setText] = useState('');
  useEffect(() => {
    setText(new Date(iso).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }));
  }, [iso]);
  return <time dateTime={iso}>{text || '…'}</time>;
}

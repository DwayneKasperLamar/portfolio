'use client';

import { useEffect, useState } from 'react';

const Footer = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Lagos',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date());

    setTime(format());
    const interval = setInterval(() => setTime(format()), 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="max-w-[640px] mx-auto px-6 pb-16 pt-12 font-mono text-xs text-muted">
      {time && (
        <p className="flex items-center gap-2">
          <span className="status-dot" />
          Open to remote work &mdash; {time} WAT
        </p>
      )}
    </footer>
  );
};

export default Footer;

'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const [time, setTime] = useState('');
  const path = usePathname();
  const home = path === '/';

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Lagos', // Nigeria's time zone
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date());

    setTime(format());
    const interval = setInterval(() => setTime(format()), 30_000);
    return () => clearInterval(interval);
  }, []);

  // The web home page has its own footer, so this one shows there on phones only.
  const frame = home ? 'px-5 md:hidden' : 'max-w-[640px] px-6';

  if (path.startsWith('/admin')) return null; // the admin has its own frame

  return (
    <footer className={`print:hidden mx-auto pb-28 pt-12 md:pb-16 text-xs text-muted ${frame}`}>
      {time && (
        <p className="flex items-center gap-2">
          <span className="status-dot" />
          Open to remote roles &mdash; {time} WAT
        </p>
      )}
    </footer>
  );
};

export default Footer;

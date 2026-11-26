'use client';

import { usePathname } from 'next/navigation';
import { Analytics, type BeforeSendEvent } from '@vercel/analytics/react';

// Counts visits to PUBLIC pages only. The private area, the admin and uploaded files are
// never reported: the component is not even loaded there, and the filter drops any stray event.
const HIDDEN = /^\/(admin|private|media)(\/|$)/;

function publicOnly(event: BeforeSendEvent) {
  return HIDDEN.test(new URL(event.url).pathname) ? null : event;
}

export default function PublicAnalytics() {
  const path = usePathname();
  if (HIDDEN.test(path)) return null;
  return <Analytics beforeSend={publicOnly} />;
}

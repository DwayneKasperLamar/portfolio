'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const CONTENT_SECTIONS = [
  { href: '/admin/collections', label: 'Collections' },
  { href: '/admin/timeline', label: 'Timeline' },
  { href: '/admin/journal', label: 'Journal' },
  { href: '/admin/pages', label: 'Pages' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/tech', label: 'Tools' },
];

// Shown under the header on every screen that belongs to "Content".
export default function ContentTabs() {
  const path = usePathname();
  if (!CONTENT_SECTIONS.some((s) => path.startsWith(s.href))) return null;
  return (
    <nav aria-label="Content" className="mb-4 flex gap-1.5 overflow-x-auto pb-1">
      {CONTENT_SECTIONS.map((s) => {
        const on = path.startsWith(s.href);
        return (
          <Link
            key={s.href}
            href={s.href}
            aria-current={on ? 'page' : undefined}
            className={`shrink-0 rounded-lg border px-3 py-1.5 text-[13px] ${on ? 'border-primary bg-primary text-inverse' : 'border-line text-muted hover:text-primary'}`}>
            {s.label}
          </Link>
        );
      })}
    </nav>
  );
}

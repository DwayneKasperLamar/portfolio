'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen, Briefcase, Clock, FileText, Image as ImageIcon, LayoutGrid, Library, Lock, Mail, Settings, User, Wrench,
} from 'lucide-react';
import { logout } from './login/actions';

const groups = [
  { title: '', links: [{ href: '/admin', label: 'Dashboard', icon: LayoutGrid }, { href: '/admin/messages', label: 'Messages', icon: Mail }] },
  {
    title: 'Content',
    links: [
      { href: '/admin/profile', label: 'Profile', icon: User },
      { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
      { href: '/admin/collections', label: 'Collections', icon: Library },
      { href: '/admin/timeline', label: 'Timeline', icon: Clock },
      { href: '/admin/journal', label: 'Journal', icon: BookOpen },
      { href: '/admin/pages', label: 'Pages', icon: FileText },
      { href: '/admin/projects', label: 'Projects', icon: Briefcase },
      { href: '/admin/tech', label: 'Tools', icon: Wrench },
    ],
  },
  {
    title: 'Site',
    links: [
      { href: '/private', label: 'Private area', icon: Lock },
      { href: '/admin/env', label: 'Settings', icon: Settings },
    ],
  },
];

// Side menu on wide screens, a scrolling row on phones. The login page gets neither.
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path === '/admin/login') return <div className="font-sans">{children}</div>;
  const active = (href: string) => (href === '/admin' ? path === href : path.startsWith(href));

  const item = (l: (typeof groups)[number]['links'][number]) => (
    <Link
      key={l.href}
      href={l.href}
      aria-current={active(l.href) ? 'page' : undefined}
      className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm ${
        active(l.href) ? 'bg-surface-alt font-semibold text-primary' : 'text-muted hover:text-primary'
      }`}>
      <l.icon size={17} aria-hidden />
      {l.label}
    </Link>
  );

  return (
    <div className="min-h-screen font-sans text-[14px] md:grid md:grid-cols-[232px_minmax(0,1fr)]">
      <aside className="border-line bg-surface md:sticky md:top-0 md:flex md:h-screen md:flex-col md:overflow-y-auto md:border-r">
        <div className="flex items-center justify-between gap-3 px-4 pt-4 md:px-5 md:pt-6">
          <Link href="/" className="font-head text-lg font-semibold text-primary">
            View site &#8599;
          </Link>
          <form action={logout} className="md:hidden">
            <button className="text-sm text-muted hover:text-primary">Log out</button>
          </form>
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto border-b border-line px-3 py-3 md:block md:border-b-0 md:py-4">
          {groups.map((g) => (
            <div key={g.title || 'main'} className="flex gap-1 md:mb-4 md:block md:space-y-0.5">
              {g.title && <p className="label hidden px-3 pb-1 md:block">{g.title}</p>}
              {g.links.map(item)}
            </div>
          ))}
        </nav>
        <form action={logout} className="mt-auto hidden px-5 pb-6 md:block">
          <button className="text-sm text-muted hover:text-primary">Log out</button>
        </form>
      </aside>
      <main className="w-full min-w-0 max-w-[1180px] px-4 py-6 md:px-10 md:py-9">{children}</main>
    </div>
  );
}

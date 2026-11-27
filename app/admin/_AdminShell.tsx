'use client';

/* eslint-disable @next/next/no-img-element -- the photo is uploaded or linked in the admin */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, FileText, Home, Image as ImageIcon, Inbox, Settings, User } from 'lucide-react';
import { logout } from './login/actions';
import { CONTENT_SECTIONS } from './_ContentTabs';

const main = [
  { href: '/admin', label: 'Home', icon: Home, also: [] as string[] },
  { href: '/admin/enquiries', label: 'Enquiries', icon: Inbox, also: [] },
  { href: '/admin/bookings', label: 'Bookings', icon: CalendarDays, also: [] },
];
const site = [
  { href: '/admin/profile', label: 'Profile', icon: User, also: [] as string[] },
  { href: '/admin/content', label: 'Content', icon: FileText, also: CONTENT_SECTIONS.map((s) => s.href) },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon, also: [] },
  { href: '/admin/settings', label: 'Settings', icon: Settings, also: [] },
];

interface Props {
  name: string;
  photo: string | null;
  newEnquiries: number;
  children: React.ReactNode;
}

// Side menu on wide screens, a block of icons on phones. The login page gets neither.
export default function AdminShell({ name, photo, newEnquiries, children }: Props) {
  const path = usePathname();
  if (path === '/admin/login') return <div className="font-sans">{children}</div>;
  const active = (href: string) => (href === '/admin' ? path === href : path.startsWith(href));

  const item = (l: (typeof main)[number]) => {
    const on = active(l.href) || l.also.some(active);
    return (
      <Link
        key={l.href}
        href={l.href}
        aria-current={on ? 'page' : undefined}
        className={`relative flex flex-col items-center gap-1 rounded-[9px] px-1 py-2 text-[11.5px] md:flex-row md:gap-2.5 md:px-2.5 md:text-sm ${
          on ? 'bg-base font-semibold text-primary ring-1 ring-line' : 'font-medium text-muted hover:text-primary'
        }`}>
        <l.icon size={17} aria-hidden />
        {l.label}
        {l.href === '/admin/enquiries' && newEnquiries > 0 && (
          <span className="absolute right-2 top-1 rounded-full bg-primary px-[7px] text-[11px] font-semibold text-inverse md:static md:ml-auto">
            {newEnquiries}
            <span className="sr-only"> waiting</span>
          </span>
        )}
      </Link>
    );
  };

  const logOut = (
    <form action={logout}>
      <button type="submit" className="text-sm text-muted hover:text-primary">Log out</button>
    </form>
  );

  return (
    <div className="min-h-screen font-sans text-[14px] md:grid md:grid-cols-[216px_minmax(0,1fr)]">
      <aside className="border-line bg-surface md:sticky md:top-0 md:flex md:h-screen md:flex-col md:overflow-y-auto md:border-r md:px-3 md:py-4">
        <div className="flex items-center gap-2.5 px-4 pt-4 md:px-1.5 md:pb-4 md:pt-0">
          {photo && <img src={photo} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />}
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold text-primary">{name}</p>
            <Link href="/" className="text-xs text-muted hover:text-primary">View site &#8599;</Link>
          </div>
          <div className="ml-auto md:hidden">{logOut}</div>
        </div>
        <nav aria-label="Admin" className="grid grid-cols-4 gap-1 border-b border-line px-3 py-3 md:flex md:flex-col md:border-b-0 md:p-0">
          {main.map(item)}
          <p className="label hidden px-2.5 pb-1 pt-4 md:block">Your site</p>
          {site.map(item)}
        </nav>
        <div className="mt-auto hidden px-2.5 pt-4 md:block">{logOut}</div>
      </aside>
      <main className="w-full min-w-0 px-4 pb-12 md:px-7">{children}</main>
    </div>
  );
}

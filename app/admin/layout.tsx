import Link from 'next/link';
import { logout } from './login/actions';

const links = [
  { href: '/admin/profile', label: 'Profile' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/tech', label: 'Tech' },
  { href: '/admin/pages', label: 'Pages' },
  { href: '/admin/timeline', label: 'Timeline' },
  { href: '/admin/journal', label: 'Journal' },
  { href: '/admin/collections', label: 'Collections' },
  { href: '/admin/env', label: 'Env' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10 font-sans">
      <div className="flex justify-between items-start gap-4 mb-8">
        <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-muted hover:text-primary">
              {l.label}
            </Link>
          ))}
          <Link href="/private" className="text-muted hover:text-primary">
            Private area →
          </Link>
        </nav>
        <form action={logout}>
          <button className="text-sm text-muted hover:text-primary whitespace-nowrap">Log out</button>
        </form>
      </div>
      {children}
    </div>
  );
}

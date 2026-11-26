import Link from 'next/link';
import type { NavLink } from '@/lib/content';

// The menu on phones: equal tabs that stay at the top while scrolling.
const PhoneTabs = ({ links }: { links: NavLink[] }) => (
  <nav className="sticky top-0 z-20 grid auto-cols-fr grid-flow-col border-y border-line bg-base md:hidden">
    {links.map((l, i) => (
      <Link
        key={l.href}
        href={l.href}
        className={`py-3 text-center text-[13px] font-medium ${i === 0 ? 'text-primary shadow-[inset_0_-2px_0_var(--text-primary)]' : 'text-muted'}`}>
        {l.short ?? l.label}
      </Link>
    ))}
  </nav>
);

export default PhoneTabs;

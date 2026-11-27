import Link from 'next/link';
import ThemeIconButton from '@/components/ThemeIconButton';
import type { NavLink } from '@/lib/content';

// The web menu bar. It stays at the top while scrolling. Phones use PhoneDock instead.
const SiteHeader = ({ name, email, links }: { name: string; email: string; links: NavLink[] }) => (
  <div className="sticky top-0 z-30 hidden border-b border-line bg-base md:block print:hidden">
    <div className="mx-auto flex h-[68px] max-w-[1160px] items-center gap-6 px-10">
      <Link href="/" className="font-head text-[22px] font-semibold text-primary">
        {name}
      </Link>
      <nav className="ml-auto flex gap-4 whitespace-nowrap text-sm font-medium text-secondary lg:gap-[26px]">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            // Tablets have less room: the extra links wait for a wider screen.
            className={`hover:text-primary hover:underline ${['Case studies', 'How I work'].includes(l.label) ? 'hidden lg:block' : ''}`}>
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <ThemeIconButton />
        <Link href="/cv" className="btn hidden h-[38px] px-4 text-[13px] lg:inline-flex">
          View CV
        </Link>
        <a href={`mailto:${email}`} className="btn btn-fill h-[38px] px-4 text-[13px]">
          Email me
        </a>
      </div>
    </div>
  </div>
);

export default SiteHeader;

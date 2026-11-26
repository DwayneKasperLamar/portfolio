import Link from 'next/link';
import ThemeToggleButton from '@/components/ThemeToggleButton';
import PhoneDock from '@/components/PhoneDock';
import { getProfile, getPublicNav } from '@/lib/content';
import { headerDetails } from '@/lib/profile-header';

interface PageShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Skip the public navigation (used by the private area). */
  hideNav?: boolean;
  backHref?: string;
  backLabel?: string;
  /** A wider column for the immersive Story and Gallery pages. */
  wide?: boolean;
}

// Shared frame for every inner page: back link, title, navigation, theme toggle.
const PageShell = async ({ title, subtitle, children, hideNav, backHref = '/', backLabel = '← Home', wide }: PageShellProps) => {
  const [nav, profile] = await Promise.all([hideNav ? Promise.resolve([]) : getPublicNav(), getProfile()]);

  return (
    <main className={`${wide ? 'max-w-[980px]' : 'max-w-[640px]'} mx-auto px-6 pt-16 print:pt-0 print:max-w-none print:px-0 print:pb-0 pb-8`}>
      <div className="print:hidden flex justify-between items-start gap-4 mb-8">
        <Link href={backHref} className="font-sans text-xs text-muted hover:text-primary">
          {backLabel}
        </Link>
        <ThemeToggleButton />
      </div>

      <h1 className="text-[28px] leading-tight font-semibold text-primary mb-1">{title}</h1>
      {subtitle && <p className="font-sans text-xs text-muted mb-6">{subtitle}</p>}

      {nav.length > 0 && (
        <nav className="hidden md:flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs text-muted mb-8 mt-4">
          {nav.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-primary">
              {l.label}
            </Link>
          ))}
        </nav>
      )}

      <div className="mt-6">{children}</div>
      {profile && <PhoneDock photo={headerDetails(profile).avatar} name={profile.name} />}
    </main>
  );
};

export default PageShell;

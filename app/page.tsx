import Link from 'next/link';
import { cookies } from 'next/headers';
import ThemeToggleButton from '@/components/ThemeToggleButton';
import TechIconRailLazy from '@/components/TechIconRailLazy';
import MobileHeader from '@/components/MobileHeader';
import Experience from '@/components/Experience';
import Section from '@/components/Section';
import TitledList from '@/components/TitledList';
import CaseStudyList from '@/components/CaseStudyList';
import Quotes from '@/components/Quotes';
import Tools from '@/components/Tools';
import Contact from '@/components/Contact';
import EmailButton from '@/components/EmailButton';
import BodyText from '@/components/BodyText';
import { ADMIN_SESSION_COOKIE, isValidSession } from '@/lib/auth';
import { getProfile, getProjects, getPublicList, getPublicNav, getTechItems, LISTS } from '@/lib/content';
import { headerDetails } from '@/lib/profile-header';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [profile, projects, techItems, nav, experience, caseStudies, ai, whatIDo, offers, quotes, contact] = await Promise.all([
    getProfile(),
    getProjects(),
    getTechItems(),
    getPublicNav(),
    getPublicList(LISTS.experience),
    getPublicList(LISTS.caseStudies),
    getPublicList(LISTS.aiWorkflow),
    getPublicList(LISTS.whatIDo),
    getPublicList(LISTS.offers),
    getPublicList(LISTS.quotes),
    getPublicList(LISTS.contact),
  ]);

  if (!profile) {
    return (
      <main className="max-w-[640px] mx-auto px-6 pt-24 pb-8">
        <p className="text-muted">
          Content isn&rsquo;t set up yet &mdash; run <code>npm run seed</code> once Supabase credentials are in
          place.
        </p>
      </main>
    );
  }

  // Only changes a button label; no private content is loaded on this page.
  const owner = await isValidSession(cookies().get(ADMIN_SESSION_COOKIE)?.value);
  const { bio } = headerDetails(profile);
  const about = [profile.current_role_text, profile.previous_role_text].filter(Boolean).join('\n\n');

  return (
    <>
      <TechIconRailLazy items={techItems} projects={projects} />
      <main className="max-w-[640px] mx-auto px-6 pt-0 md:pt-24 pb-8">
        <MobileHeader
          profile={profile}
          counts={{
            roles: experience.filter((e) => e.status?.toLowerCase() === 'current').length,
            caseStudies: caseStudies.length,
          }}
          owner={owner}
        />

        {/* Web header */}
        <div className="hidden md:block mb-6">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h1 className="text-xl font-semibold text-primary mb-1">{profile.name}</h1>
              <p className="font-mono text-xs text-muted">
                {profile.location} &middot; {profile.role_title}
              </p>
            </div>
            <ThemeToggleButton />
          </div>
          {bio && <p className="mt-6 text-xl leading-snug text-primary">{bio}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <EmailButton email={profile.email} />
            <Link href="/cv" className="inline-flex items-center justify-center rounded-full border border-line px-5 py-2 text-sm font-semibold text-primary hover:border-muted transition-colors">
              View CV
            </Link>
            {profile.now_text && (
              <span className="flex items-center gap-2 font-mono text-xs text-muted">
                <span className="status-dot" />
                {profile.now_text}
              </span>
            )}
          </div>
        </div>

        {nav.length > 0 && (
          <nav className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted mb-10">
            {nav.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-primary">
                {l.label}
              </Link>
            ))}
          </nav>
        )}

        <Experience items={experience} />

        {caseStudies.length > 0 && (
          <Section title="Case studies" id="case-studies">
            <CaseStudyList items={caseStudies} />
          </Section>
        )}

        <TitledList title="How I work with AI" items={ai} />
        <TitledList title="What I do" items={whatIDo} />
        <TitledList title="Work with me" items={offers}>
          <p className="mt-5">
            <EmailButton email={profile.email} subject="Working together">
              Email me about it
            </EmailButton>
          </p>
        </TitledList>
        <Quotes items={quotes} />

        {about && (
          <Section title="About">
            <BodyText text={about} />
          </Section>
        )}
        <Tools items={techItems} projects={projects} />

        <hr className="border-line my-10" />
        <Contact profile={profile} extra={contact} />
      </main>
    </>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import PrintButton from '@/components/PrintButton';
import Section from '@/components/Section';
import { getProfile, getPublicList, getTechItems, LISTS } from '@/lib/content';
import { headerDetails } from '@/lib/profile-header';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'CV — Dwayne Kasper, Software Architect' };

// One page, built from the same content as the site, so it never falls out of date.
export default async function CvPage() {
  const [profile, experience, ai, whatIDo, tools, contact] = await Promise.all([
    getProfile(),
    getPublicList(LISTS.experience),
    getPublicList(LISTS.aiWorkflow),
    getPublicList(LISTS.whatIDo),
    getTechItems(),
    getPublicList(LISTS.contact),
  ]);
  if (!profile) notFound();
  const d = headerDetails(profile);
  const reach = [profile.email, ...contact.map((c) => c.title), profile.github_url.replace(/^https?:\/\//, ''), profile.now_text];
  const lists = [
    { title: 'How I work with AI', items: ai },
    { title: 'What I do', items: whatIDo },
  ];

  return (
    <PageShell title={profile.name} subtitle={`${profile.role_title} · ${profile.location}`} hideNav>
      <div className="text-[0.92rem] print:text-[10pt] print:leading-snug">
        <p className="mb-1">{d.bio}</p>
        <p className="font-mono text-xs text-muted mb-4 break-words">{reach.filter(Boolean).join(' · ')}</p>
        <p className="mb-8 print:hidden">
          <PrintButton />
        </p>

        <Section title="Work experience">
          <ul className="space-y-3">
            {experience.map((e) => (
              <li key={e.id} className="break-inside-avoid">
                <p>
                  <b>{e.subtitle}</b> &middot; {e.title}
                  {e.status && <span className="font-mono text-xs text-muted"> &middot; {e.status}</span>}
                </p>
                <p className="text-secondary">{e.notes}</p>
              </li>
            ))}
          </ul>
        </Section>

        {lists.map(
          (list) =>
            list.items.length > 0 && (
              <Section key={list.title} title={list.title}>
                <ul className="space-y-1.5">
                  {list.items.map((i) => (
                    <li key={i.id} className="break-inside-avoid">
                      <b>{i.title}.</b> {i.notes}
                    </li>
                  ))}
                </ul>
              </Section>
            ),
        )}

        <Section title="Tools">
          <p>{tools.map((t) => t.label).join(' · ')}</p>
        </Section>
      </div>
    </PageShell>
  );
}

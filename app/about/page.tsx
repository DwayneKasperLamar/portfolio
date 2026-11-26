import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/PageShell';
import Section from '@/components/Section';
import ProjectBullet from '@/components/ProjectBullet';
import ReadingWidget from '@/components/widgets/ReadingWidget';
import JournalWidget from '@/components/widgets/JournalWidget';
import { getLatestPublicJournalEntry, getPersonalLinks, getProjects, getReadingNow } from '@/lib/content';
import { safeUrl } from '@/lib/safe-url';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'About — Dwayne Kasper' };

// The person behind the work: story, gallery, journal, books and all projects.
export default async function AboutPage() {
  const [links, projects, reading, latest] = await Promise.all([
    getPersonalLinks(),
    getProjects(),
    getReadingNow(),
    getLatestPublicJournalEntry(),
  ]);

  return (
    <PageShell title="About me" subtitle="Beyond the work">
      {links.length > 0 && (
        <Section title="Read and watch">
          <ul className="space-y-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="underline decoration-line hover:decoration-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {(reading.length > 0 || latest) && (
        <div className="grid gap-4 sm:grid-cols-2 mb-10">
          <ReadingWidget items={reading} />
          <JournalWidget entry={latest} />
        </div>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          <ul className="space-y-3">
            {projects.map((project) => {
              const href = safeUrl(project.href);
              return (
                <li key={project.slug} className="flex items-center gap-3 text-[0.95rem]">
                  <ProjectBullet logoUrl={project.logo_url} title={project.title} />
                  <span>
                    {href ? (
                      <a href={href} target="_blank" rel="noreferrer" className="underline decoration-line hover:decoration-primary">
                        {project.title}
                      </a>
                    ) : (
                      project.title
                    )}{' '}
                    &mdash; {project.description}
                  </span>
                </li>
              );
            })}
          </ul>
        </Section>
      )}
    </PageShell>
  );
}

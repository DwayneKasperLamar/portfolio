import ThemeToggleButton from '@/components/ThemeToggleButton';
import TechIconRailLazy from '@/components/TechIconRailLazy';
import { getProfile, getProjects, getTechItems } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [profile, projects, techItems] = await Promise.all([getProfile(), getProjects(), getTechItems()]);

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

  const stackItems = techItems.filter((t) => t.category === 'stack');

  return (
    <>
      <TechIconRailLazy items={techItems} projects={projects} />
      <main className="max-w-[640px] mx-auto px-6 pt-24 pb-8">
        <div className="flex justify-between items-start gap-4 mb-10">
          <div>
            <h1 className="text-xl font-semibold text-primary mb-1">{profile.name}</h1>
            <p className="font-mono text-xs text-muted">
              {profile.location} &middot; {profile.role_title}
            </p>
          </div>
          <ThemeToggleButton />
        </div>

        <section className="mb-6">
          <p>{profile.current_role_text}</p>
        </section>

        <section className="mb-6">
          <p>{profile.previous_role_text}</p>
        </section>

        <hr className="border-line my-10" />

        <section className="mb-6">
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted mb-4">Projects</h2>
          <ul className="space-y-2.5">
            {projects.map((project) => (
              <li key={project.slug} className="flex gap-3 text-[0.95rem]">
                <span className="text-line">&mdash;</span>
                <span>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-line hover:decoration-primary">
                    {project.title}
                  </a>{' '}
                  &mdash; {project.description}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted mb-4">Stack</h2>
          <p className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {stackItems.map((item) => (
              <span key={item.id}>{item.label}</span>
            ))}
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted mb-4">Now</h2>
          <p>{profile.now_text}</p>
        </section>

        <hr className="border-line my-10" />

        <section>
          <p>
            Reach me at{' '}
            <a href={`mailto:${profile.email}`} className="underline decoration-line hover:decoration-primary">
              {profile.email}
            </a>
            , or find me on{' '}
            <a href={profile.github_url} target="_blank" rel="noreferrer" className="underline decoration-line hover:decoration-primary">
              GitHub
            </a>{' '}
            and{' '}
            <a href={profile.twitter_url} target="_blank" rel="noreferrer" className="underline decoration-line hover:decoration-primary">
              Twitter
            </a>
            .
          </p>
        </section>
      </main>
    </>
  );
}

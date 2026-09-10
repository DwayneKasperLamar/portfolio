import { myProjects } from '@/content/projects';
import ThemeToggleButton from '@/components/ThemeToggleButton';

export default function Home() {
  return (
    <main className="max-w-[640px] mx-auto px-6 pt-24 pb-8">
      <div className="flex justify-between items-start gap-4 mb-10">
        <div>
          <h1 className="text-xl font-semibold text-primary mb-1">Dwayne Kasper</h1>
          <p className="font-mono text-xs text-muted">Lagos, Nigeria &middot; Software Developer &middot; updated Sep 2026</p>
        </div>
        <ThemeToggleButton />
      </div>

      <section className="mb-6">
        <p>
          I&rsquo;m a software developer working mostly in React, Next.js, TypeScript and Expo &mdash; across web
          and mobile. Currently lead developer at{' '}
          <a href="https://uncollos.store/" target="_blank" rel="noreferrer" className="underline decoration-line hover:decoration-primary">
            Uncollos
          </a>
          , an interior design company building a furniture customization platform.
        </p>
      </section>

      <section className="mb-6">
        <p>
          Before that I was a mobile developer at{' '}
          <a href="https://spaxe.site" target="_blank" rel="noreferrer" className="underline decoration-line hover:decoration-primary">
            Spaxe
          </a>{' '}
          (formerly SPACE), a house-renting platform built around budget and location search, with a 3D view of
          listings before you rent or buy.
        </p>
      </section>

      <hr className="border-line my-10" />

      <section className="mb-6">
        <h2 className="font-mono text-xs uppercase tracking-wider text-muted mb-4">Projects</h2>
        <ul className="space-y-2.5">
          {myProjects.map((project) => (
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
                &mdash; {project.desc}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="font-mono text-xs uppercase tracking-wider text-muted mb-4">Stack</h2>
        <p className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Expo / React Native', 'Three.js & React Three Fiber', 'GSAP'].map(
            (tool) => (
              <span key={tool}>{tool}</span>
            ),
          )}
        </p>
      </section>

      <section className="mb-6">
        <h2 className="font-mono text-xs uppercase tracking-wider text-muted mb-4">Now</h2>
        <p>
          Building{' '}
          <a
            href="https://vulltra-inc.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-line hover:decoration-primary">
            Vulttra
          </a>
          , and generally leaning into AI-assisted product workflows &mdash; it shows up across Vulttra, Kosher Spa, and
          the AI interview tool{' '}
          <a
            href="https://bogey-interview.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-line hover:decoration-primary">
            Bogey
          </a>
          .
        </p>
      </section>

      <hr className="border-line my-10" />

      <section>
        <p>
          Reach me at{' '}
          <a href="mailto:dwaynekasperlamar@gmail.com" className="underline decoration-line hover:decoration-primary">
            dwaynekasperlamar@gmail.com
          </a>
          , or find me on{' '}
          <a
            href="https://github.com/DwaynekasperLamar"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-line hover:decoration-primary">
            GitHub
          </a>{' '}
          and{' '}
          <a
            href="https://twitter.com/Dwaynekasper_"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-line hover:decoration-primary">
            Twitter
          </a>
          .
        </p>
      </section>
    </main>
  );
}

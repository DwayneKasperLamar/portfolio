import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import TimelineList from '@/components/TimelineList';
import Experience from '@/components/gallery/Experience';
import { fromTimeline } from '@/components/gallery/media';
import { getPublicTimeline } from '@/lib/content';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Story — Dwayne Kasper' };

export default async function StoryPage() {
  const events = await getPublicTimeline();

  return (
    <PageShell title="Story" subtitle="A timeline, oldest first" wide>
      {events.length === 0 ? (
        <p className="text-muted">Nothing here yet.</p>
      ) : (
        <>
          <Experience kind="story" moments={fromTimeline(events)} />
          <details className="mt-10 max-w-[592px]">
            <summary className="cursor-pointer font-mono text-xs text-muted hover:text-primary mb-6">Read it as a list</summary>
            <TimelineList events={events} />
          </details>
        </>
      )}
    </PageShell>
  );
}

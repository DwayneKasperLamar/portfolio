import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import TimelineList from '@/components/TimelineList';
import { getPublicTimeline } from '@/lib/content';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Story — Dwayne Kasper' };

export default async function StoryPage() {
  const events = await getPublicTimeline();

  return (
    <PageShell title="Story" subtitle="A timeline, oldest first">
      {events.length === 0 ? <p className="text-muted">Nothing here yet.</p> : <TimelineList events={events} />}
    </PageShell>
  );
}

import Link from 'next/link';
import { ExplainNote, PageHead } from './_ui';
import {
  getOwnerCollections, getOwnerItems, getOwnerJournal, getOwnerPages, getOwnerProjects, getOwnerTimeline, LISTS,
} from '@/lib/content';
import { alertsConfigured, getOwnerMessages, messagesReady } from '@/lib/messages';

export const dynamic = 'force-dynamic';

function Card({ href, title, big, small }: { href: string; title: string; big: string | number; small: string }) {
  return (
    <Link href={href} className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-muted">
      <span className="label">{title}</span>
      <span className="font-head text-3xl font-semibold text-primary">{big}</span>
      <span className="text-sm text-muted">{small}</span>
    </Link>
  );
}

export default async function AdminDashboard() {
  const [ready, messages, collections, items, timeline, journal, pages, projects] = await Promise.all([
    messagesReady(), getOwnerMessages(), getOwnerCollections(), getOwnerItems(), getOwnerTimeline(), getOwnerJournal(),
    getOwnerPages(), getOwnerProjects(),
  ]);

  const gallerySlugs = collections.filter((c) => c.kind === 'carousel').map((c) => c.slug);
  const gallery = items.filter((i) => gallerySlugs.includes(i.collection_slug));
  const cases = items.filter((i) => i.collection_slug === LISTS.caseStudies);
  const jobs = items.filter((i) => i.collection_slug === LISTS.experience);
  const open = <T extends { visibility: string }>(list: T[]) => list.filter((x) => x.visibility === 'public').length;
  const split = <T extends { visibility: string }>(list: T[]) => `${open(list)} public · ${list.length - open(list)} private`;
  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <div>
      <PageHead title="Dashboard" />
      <ExplainNote>Everything on your site in one place. Choose a card to edit it.</ExplainNote>

      {!ready && (
        <p className="mb-4 rounded-xl border border-line bg-surface-alt p-4 text-sm">
          <b>One step left for the message box:</b> run <code>supabase/004_messages.sql</code> in the Supabase SQL editor. The form
          appears on your site as soon as it has run.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <Card href="/admin/messages" title="Messages" big={ready ? unread : '—'}
          small={ready ? `unread of ${messages.length}${alertsConfigured() ? '' : ' · email alerts off'}` : 'not set up yet'} />
        <Card href="/admin/gallery" title="Gallery" big={gallery.length} small={gallery.length ? split(gallery) : 'add your first photos'} />
        <Card href={`/admin/collections/${LISTS.experience}`} title="Work experience" big={jobs.length} small={split(jobs)} />
        <Card href="/private" title="Case studies" big={cases.length} small={split(cases)} />
        <Card href="/admin/timeline" title="Timeline (Story)" big={timeline.length} small={split(timeline)} />
        <Card href="/admin/journal" title="Journal" big={journal.length} small={split(journal)} />
        <Card href="/admin/collections" title="Collections" big={collections.length} small={split(collections)} />
        <Card href="/admin/projects" title="Projects" big={projects.length} small="shown on About me" />
        <Card href="/admin/pages" title="Pages" big={pages.length} small={split(pages)} />
      </div>
    </div>
  );
}

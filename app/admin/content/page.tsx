import Link from 'next/link';
import { ExplainNote, PageHead, btnClass } from '../_ui';
import {
  getOwnerCollections, getOwnerItems, getOwnerJournal, getOwnerPages, getOwnerProjects, getOwnerTimeline, getTechItems, LISTS,
} from '@/lib/content';
import { requireOwner } from '@/lib/owner';

export const dynamic = 'force-dynamic';

export default async function AdminContentPage() {
  await requireOwner('/admin/content');
  const [collections, items, timeline, journal, pages, projects, tools] = await Promise.all([
    getOwnerCollections(), getOwnerItems(), getOwnerTimeline(), getOwnerJournal(), getOwnerPages(), getOwnerProjects(), getTechItems(),
  ]);

  const split = (list: { visibility: string }[]) => {
    const open = list.filter((x) => x.visibility === 'public').length;
    return `${open} public · ${list.length - open} private`;
  };
  const jobs = items.filter((i) => i.collection_slug === LISTS.experience);

  const cards = [
    { href: `/admin/collections/${LISTS.experience}`, title: 'Work experience', count: jobs.length, small: split(jobs) },
    { href: '/admin/collections', title: 'Collections', count: collections.length, small: split(collections) },
    { href: '/admin/timeline', title: 'Timeline (Story)', count: timeline.length, small: split(timeline) },
    { href: '/admin/journal', title: 'Journal', count: journal.length, small: split(journal) },
    { href: '/admin/pages', title: 'Pages', count: pages.length, small: split(pages) },
    { href: '/admin/projects', title: 'Projects', count: projects.length, small: 'shown on About me' },
    { href: '/admin/tech', title: 'Tools', count: tools.length, small: 'the logos on your home page' },
  ];

  return (
    <div>
      <PageHead title="Content">
        <Link href="/private" className={btnClass}>Open private area</Link>
      </PageHead>
      <ExplainNote>Everything written on your site. Choose what to edit. Each thing is private until you mark it public.</ExplainNote>
      <ul className="grid grid-cols-2 gap-3.5 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((c) => (
          <li key={c.href}>
            <Link href={c.href} className="flex h-full flex-col gap-1 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-muted">
              <span className="label">{c.title}</span>
              <span className="font-head text-3xl font-semibold leading-tight text-primary">{c.count}</span>
              <span className="text-[13px] text-muted">{c.small}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

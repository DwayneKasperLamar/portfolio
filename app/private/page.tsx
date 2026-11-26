import Link from 'next/link';
import PageShell from '@/components/PageShell';
import TimelineList from '@/components/TimelineList';
import JournalList from '@/components/JournalList';
import CollectionView from '@/components/CollectionView';
import CaseStudyList from '@/components/CaseStudyList';
import {
  COLLECTION_KIND_LABELS,
  getOwnerCollections,
  getOwnerItems,
  getOwnerJournal,
  getOwnerPages,
  getOwnerProjects,
  getOwnerTimeline,
  LISTS,
} from '@/lib/content';

const sectionHeading = 'label mb-4';

// Everything marked "private", in one place. Only the owner can open this.
export default async function PrivateHome() {
  const [pages, timeline, journal, collections, items, projects] = await Promise.all([
    getOwnerPages(),
    getOwnerTimeline(),
    getOwnerJournal(),
    getOwnerCollections(),
    getOwnerItems(),
    getOwnerProjects(),
  ]);

  const privatePages = pages.filter((p) => p.visibility === 'private');
  const privateTimeline = timeline.filter((e) => e.visibility === 'private');
  const privateJournal = journal.filter((e) => e.visibility === 'private');
  const privateProjects = projects.filter((p) => p.visibility === 'private');

  const drafts = items.filter((i) => i.collection_slug === LISTS.caseStudies && i.visibility === 'private');

  // A collection shows here if it is private, or if it is public but holds private items.
  const blocks = collections
    .filter((c) => c.slug !== LISTS.caseStudies)
    .map((collection) => {
      const own = items.filter((i) => i.collection_slug === collection.slug);
      const shown = collection.visibility === 'private' ? own : own.filter((i) => i.visibility === 'private');
      return { collection, shown };
    })
    .filter((b) => b.collection.visibility === 'private' || b.shown.length > 0);

  const empty =
    privatePages.length + privateTimeline.length + privateJournal.length + privateProjects.length + blocks.length + drafts.length === 0;

  return (
    <PageShell
      title="Private"
      subtitle="Only you can see this. Public things live on the public site."
      hideNav
      backLabel="← Site">
      <p className="mb-8 font-sans text-xs">
        <Link href="/admin/journal" className="text-muted hover:text-primary">
          Edit in admin →
        </Link>
      </p>

      {empty && <p className="text-muted">Nothing private yet. Mark something &ldquo;private&rdquo; in the admin and it appears here.</p>}

      {drafts.length > 0 && (
        <section className="mb-10">
          <h2 className={sectionHeading}>Case study drafts</h2>
          <p className="text-sm text-muted mb-3">
            Read each one. To publish: Admin &rarr; Collections &rarr; Case studies &rarr; the item &rarr; Public.
          </p>
          <CaseStudyList items={drafts} basePath="/private/work" />
        </section>
      )}

      {privatePages.length > 0 && (
        <section className="mb-10">
          <h2 className={sectionHeading}>Pages</h2>
          <ul className="space-y-2">
            {privatePages.map((p) => (
              <li key={p.slug}>
                <Link href={`/private/p/${p.slug}`} className="underline decoration-line hover:decoration-primary">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {privateJournal.length > 0 && (
        <section className="mb-10">
          <h2 className={sectionHeading}>Journal</h2>
          <JournalList entries={privateJournal} basePath="/private/journal" />
        </section>
      )}

      {privateTimeline.length > 0 && (
        <section className="mb-10">
          <h2 className={sectionHeading}>Timeline</h2>
          <TimelineList events={privateTimeline} />
        </section>
      )}

      {blocks.map(({ collection, shown }) => (
        <section key={collection.slug} className="mb-10">
          <h2 className={sectionHeading}>
            {collection.title} &middot; {COLLECTION_KIND_LABELS[collection.kind]}
            {collection.visibility === 'public' && ' · private items only'}
          </h2>
          <CollectionView collection={collection} items={shown} />
        </section>
      ))}

      {privateProjects.length > 0 && (
        <section className="mb-10">
          <h2 className={sectionHeading}>Projects</h2>
          <ul className="space-y-2">
            {privateProjects.map((p) => (
              <li key={p.slug}>
                {p.title} &mdash; {p.description}
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageShell>
  );
}

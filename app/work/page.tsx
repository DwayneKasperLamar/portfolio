import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import CaseStudyList from '@/components/CaseStudyList';
import { getPublicList, LISTS } from '@/lib/content';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Case studies — Dwayne Kasper' };

export default async function WorkPage() {
  const items = await getPublicList(LISTS.caseStudies);
  return (
    <PageShell title="Case studies" subtitle="Problems, decisions and what was rejected">
      {items.length === 0 ? <p className="text-muted">Nothing here yet.</p> : <CaseStudyList items={items} />}
    </PageShell>
  );
}

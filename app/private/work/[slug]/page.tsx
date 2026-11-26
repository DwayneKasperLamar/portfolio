import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import CaseStudy from '@/components/CaseStudy';
import { getOwnerItems, LISTS } from '@/lib/content';
import { slugify } from '@/lib/slug';

// Preview of a draft case study, exactly as it will look. Owner only (private layout).
export default async function DraftCaseStudy({ params }: { params: { slug: string } }) {
  const item = (await getOwnerItems(LISTS.caseStudies)).find((i) => slugify(i.title) === params.slug);
  if (!item) notFound();

  return (
    <PageShell
      title={item.title}
      subtitle={[item.subtitle, item.visibility === 'private' ? 'draft: only you can see this' : 'public'].filter(Boolean).join(' · ')}
      hideNav
      backHref="/private"
      backLabel="← Private">
      <CaseStudy item={item} />
    </PageShell>
  );
}

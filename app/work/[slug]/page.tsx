import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import CaseStudy from '@/components/CaseStudy';
import EmailButton from '@/components/EmailButton';
import { getProfile, getPublicList, LISTS } from '@/lib/content';
import { slugify } from '@/lib/slug';

export const dynamic = 'force-dynamic';

const find = async (slug: string) => (await getPublicList(LISTS.caseStudies)).find((i) => slugify(i.title) === slug);

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const item = await find(params.slug);
  return item ? { title: `${item.title} — Dwayne Kasper`, description: item.status ?? undefined } : { title: 'Not found' };
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const [item, profile] = await Promise.all([find(params.slug), getProfile()]);
  if (!item) notFound();

  return (
    <PageShell title={item.title} subtitle={item.subtitle ?? undefined} backHref="/work" backLabel="← Case studies">
      <CaseStudy item={item} />
      {profile && (
        <p className="mt-10">
          <EmailButton email={profile.email} subject={`About: ${item.title}`}>
            Talk to me about this
          </EmailButton>
        </p>
      )}
    </PageShell>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import BodyText from '@/components/BodyText';
import { getPublicPage } from '@/lib/content';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await getPublicPage(params.slug);
  return { title: page ? `${page.title} — Dwayne Kasper` : 'Not found' };
}

export default async function CustomPage({ params }: { params: { slug: string } }) {
  const page = await getPublicPage(params.slug);
  if (!page) notFound();

  return (
    <PageShell title={page.title}>
      <BodyText text={page.body} />
    </PageShell>
  );
}

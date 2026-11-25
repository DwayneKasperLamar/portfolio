import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import CollectionView from '@/components/CollectionView';
import { COLLECTION_KIND_LABELS, getPublicCollection } from '@/lib/content';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getPublicCollection(params.slug);
  return { title: data ? `${data.collection.title} — Dwayne Kasper` : 'Not found' };
}

export default async function CollectionPage({ params }: { params: { slug: string } }) {
  const data = await getPublicCollection(params.slug);
  if (!data) notFound();

  return (
    <PageShell title={data.collection.title} subtitle={COLLECTION_KIND_LABELS[data.collection.kind]}>
      {data.collection.description && <p className="mb-8">{data.collection.description}</p>}
      <CollectionView collection={data.collection} items={data.items} />
    </PageShell>
  );
}

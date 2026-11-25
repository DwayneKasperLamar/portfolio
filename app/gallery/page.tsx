import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import Experience from '@/components/gallery/Experience';
import { fromGalleryItems } from '@/components/gallery/media';
import { getPublicGalleryItems } from '@/lib/content';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Gallery — Dwayne Kasper' };

export default async function GalleryPage() {
  const items = await getPublicGalleryItems();

  return (
    <PageShell title="Gallery" subtitle="Videos and photos" wide>
      {items.length === 0 ? <p className="text-muted">Nothing here yet.</p> : <Experience kind="gallery" moments={fromGalleryItems(items)} />}
    </PageShell>
  );
}

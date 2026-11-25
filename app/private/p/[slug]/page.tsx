import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import BodyText from '@/components/BodyText';
import { getOwnerPage } from '@/lib/content';

export default async function PrivatePage({ params }: { params: { slug: string } }) {
  const page = await getOwnerPage(params.slug);
  if (!page) notFound();

  return (
    <PageShell title={page.title} hideNav backHref="/private" backLabel="← Private">
      <BodyText text={page.body} />
    </PageShell>
  );
}

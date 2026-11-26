import type { CollectionItem } from '@/lib/content';
import { safeUrl } from '@/lib/safe-url';
import SafeImage from '@/components/SafeImage';
import BodyText from '@/components/BodyText';

const CaseStudy = ({ item }: { item: CollectionItem }) => {
  const image = safeUrl(item.image_url);
  return (
    <article>
      {item.status && <p className="text-lg text-secondary mb-6">{item.status}</p>}
      {image && <SafeImage src={image} alt={item.title} width={592} height={360} className="w-full h-auto rounded-lg border border-line mb-6" />}
      <BodyText text={item.notes} />
    </article>
  );
};

export default CaseStudy;

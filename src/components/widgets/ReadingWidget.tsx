import type { CollectionItem } from '@/lib/content';
import { safeUrl } from '@/lib/safe-url';
import SafeImage from '@/components/SafeImage';
import WidgetCard from '@/components/widgets/WidgetCard';

// Fed by the Books collection: any public book with a status containing "reading".
const ReadingWidget = ({ items }: { items: CollectionItem[] }) => {
  if (items.length === 0) return null;
  return (
    <WidgetCard label="Reading now">
      <ul className="space-y-3">
        {items.map((b) => (
          <li key={b.id} className="flex gap-3 items-center">
            {b.image_url && (
              <SafeImage src={safeUrl(b.image_url)} alt={b.title} width={36} height={48} className="w-9 h-12 object-cover rounded-sm border border-line" />
            )}
            <p className="text-sm">
              <span className="text-primary">{b.title}</span>
              {b.subtitle && <span className="block font-mono text-xs text-muted">{b.subtitle}</span>}
            </p>
          </li>
        ))}
      </ul>
    </WidgetCard>
  );
};

export default ReadingWidget;

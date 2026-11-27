import { safeUrl } from '@/lib/safe-url';
import SafeImage from '@/components/SafeImage';

// Opens a WhatsApp chat. The number is set in Admin > Settings.
const WhatsAppButton = ({ url, className = '' }: { url: string; className?: string }) => {
  const href = safeUrl(url);
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noreferrer" className={`inline-flex h-11 items-center justify-center gap-2.5 rounded-[10px] border border-current px-5 text-sm font-semibold ${className}`}>
      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-chip">
        <SafeImage src="https://cdn.simpleicons.org/whatsapp" alt="" width={15} height={15} />
      </span>
      Chat on WhatsApp
    </a>
  );
};

export default WhatsAppButton;

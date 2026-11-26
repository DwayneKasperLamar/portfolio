'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Share, Sun } from 'lucide-react';

const round = 'flex items-center justify-center w-9 h-9 rounded-full bg-veil text-on-veil';

export function CoverButtons({ title }: { title: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === 'dark';

  return (
    <div className="absolute right-3 top-3 flex gap-2">
      <button type="button" className={round} onClick={() => setTheme(dark ? 'light' : 'dark')} aria-label="Switch light or dark">
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <ShareButton title={title} className={round}>
        <Share size={18} />
      </ShareButton>
    </div>
  );
}

// Opens the phone's share sheet; where there is none, copies the address.
export function ShareButton({ title, className, children }: { title: string; className: string; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.origin;
    try {
      if (navigator.share) await navigator.share({ title, url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // closing the share sheet is not an error worth showing
    }
  }

  return (
    <button type="button" onClick={share} className={className} aria-label="Share profile">
      {copied ? <span className="text-xs">Copied</span> : children}
    </button>
  );
}

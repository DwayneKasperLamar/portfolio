'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

// Light / dark switch as a small square button.
export default function ThemeIconButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label="Switch light or dark"
      className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border border-line text-primary hover:border-muted">
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}

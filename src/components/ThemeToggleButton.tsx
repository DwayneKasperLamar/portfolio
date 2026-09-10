'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

const ThemeToggleButton = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="font-mono text-xs text-muted border border-line rounded px-3 py-1.5 hover:text-primary hover:border-muted transition-colors"
      aria-label="Toggle theme">
      {mounted ? (resolvedTheme === 'dark' ? 'light' : 'dark') : 'theme'}
    </button>
  );
};

export default ThemeToggleButton;

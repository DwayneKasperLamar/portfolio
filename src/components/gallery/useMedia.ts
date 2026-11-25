'use client';

import { useEffect, useState } from 'react';

// undefined until the browser has answered, so nothing flashes the wrong layout.
export function useMedia(query: string): boolean | undefined {
  const [matches, setMatches] = useState<boolean>();
  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener('change', update);
    return () => list.removeEventListener('change', update);
  }, [query]);
  return matches;
}

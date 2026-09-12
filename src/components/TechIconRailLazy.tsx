'use client';

import dynamic from 'next/dynamic';
import type { TechItem, Project } from '@/lib/content';

// Loaded only on the client, after initial hydration: the three.js/fiber/drei
// bundle is sizeable and this rail is purely decorative, so it shouldn't
// block or bloat the initial page render. `ssr: false` isn't allowed in a
// Server Component, hence this thin client wrapper.
const TechIconRail = dynamic(() => import('./TechIconRail'), { ssr: false });

interface TechIconRailLazyProps {
  items: TechItem[];
  projects: Project[];
}

export default function TechIconRailLazy(props: TechIconRailLazyProps) {
  return <TechIconRail {...props} />;
}

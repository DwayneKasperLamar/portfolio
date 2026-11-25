import type { Metadata } from 'next';
import { requireOwner } from '@/lib/owner';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Private',
  robots: { index: false, follow: false },
};

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  await requireOwner('/private');
  return <>{children}</>;
}

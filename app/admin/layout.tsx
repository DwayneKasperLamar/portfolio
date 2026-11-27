import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import AdminShell from './_AdminShell';
import { ADMIN_SESSION_COOKIE, isValidSession } from '@/lib/auth';
import { getProfile } from '@/lib/content';
import { countNewEnquiries } from '@/lib/enquiries';
import { headerDetails } from '@/lib/profile-header';

export const metadata: Metadata = { title: 'Admin', robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Checked here too: this layout also wraps the login page, and nothing about enquiries may reach it.
  const owner = await isValidSession(cookies().get(ADMIN_SESSION_COOKIE)?.value);
  const [profile, newEnquiries] = owner ? await Promise.all([getProfile(), countNewEnquiries()]) : [null, 0];

  return (
    <AdminShell name={profile?.name ?? 'Admin'} photo={profile ? headerDetails(profile).avatar : null} newEnquiries={newEnquiries}>
      {children}
    </AdminShell>
  );
}

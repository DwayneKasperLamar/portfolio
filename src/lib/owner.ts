import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_SESSION_COOKIE, isValidSession } from '@/lib/auth';

// Second lock behind middleware: every private page and every admin action
// checks the owner cookie itself, so a future change to the middleware
// matcher cannot silently expose private content.
export async function requireOwner(returnTo = '/admin'): Promise<void> {
  if (!(await isValidSession(cookies().get(ADMIN_SESSION_COOKIE)?.value))) {
    redirect(`/admin/login?next=${encodeURIComponent(returnTo)}`);
  }
}

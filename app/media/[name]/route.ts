import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, isValidSession } from '@/lib/auth';
import { isPublicMedia } from '@/lib/content';
import { getSupabase } from '@/lib/supabase';
import { MEDIA_BUCKET, MEDIA_NAME } from '@/lib/upload-rules';

export const dynamic = 'force-dynamic';

// The only door to uploaded files (the bucket itself is private). The owner can open anything;
// everyone else only files that something PUBLIC is using right now, so switching an entry to
// private also closes its photo or video. The answer is a link that expires after an hour.
export async function GET(_request: Request, { params }: { params: { name: string } }) {
  const notFound = () => new NextResponse('Not found', { status: 404, headers: { 'Cache-Control': 'private, no-store' } });
  if (!MEDIA_NAME.test(params.name)) return notFound();

  const owner = await isValidSession(cookies().get(ADMIN_SESSION_COOKIE)?.value);
  if (!owner && !(await isPublicMedia(`/media/${params.name}`))) return notFound();

  const { data, error } = await getSupabase().storage.from(MEDIA_BUCKET).createSignedUrl(params.name, 3600);
  if (error || !data) return notFound();

  return NextResponse.redirect(data.signedUrl, { status: 307, headers: { 'Cache-Control': 'private, no-store' } });
}

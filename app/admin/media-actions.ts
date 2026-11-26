'use server';

import { requireOwner } from '@/lib/owner';
import { getSupabase } from '@/lib/supabase';
import { MEDIA_BUCKET, UPLOAD_TYPES, uploadProblem } from '@/lib/upload-rules';

export type UploadTicket = { uploadUrl: string; path: string } | { error: string };

// Gives the browser a one-time address to send a file straight to storage. (Files do not pass
// through our server: Vercel refuses request bodies over 4.5 MB.)
export async function createUpload(type: string, size: number): Promise<UploadTicket> {
  await requireOwner();
  const problem = uploadProblem(type, size);
  if (problem) return { error: problem };

  // The name is random and the ending comes from the checked type, never from the file's own name.
  const name = `${crypto.randomUUID()}.${UPLOAD_TYPES[type]}`;
  const { data, error } = await getSupabase().storage.from(MEDIA_BUCKET).createSignedUploadUrl(name);
  if (error || !data) {
    return { error: `Storage said: ${error?.message ?? 'no answer'}. Has supabase/003_profile_and_media.sql been run?` };
  }
  return { uploadUrl: data.signedUrl, path: `/media/${name}` };
}

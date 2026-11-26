// What may be uploaded, shared by the browser (early, friendly check) and the server (the real check).
// The storage bucket enforces the same type and size limits a third time (supabase/003_profile_and_media.sql).
export const MEDIA_BUCKET = 'media';
export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // Supabase free plan limit per file

// No SVG: an SVG can carry script.
export const UPLOAD_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
};

export const MEDIA_NAME = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp|gif|mp4|webm|mov)$/;

export function uploadProblem(type: string, size: number): string | null {
  if (!UPLOAD_TYPES[type]) return 'Only photos (JPG, PNG, WebP, GIF) and videos (MP4, WebM, MOV) can be uploaded.';
  if (!Number.isFinite(size) || size <= 0) return 'That file looks empty.';
  if (size > MAX_UPLOAD_BYTES) return 'Over 50 MB. Trim or compress it, or put the video on YouTube and paste the link.';
  return null;
}

import type { Profile } from '@/lib/content';

// What the phone header shows. Used by the header AND to pre-fill the admin form, so pressing
// Save never silently blanks something that was showing.
export const DEFAULT_AVATAR = '/assets/me.jpeg';

export function headerDetails(p: Profile) {
  const fromX = p.twitter_url.match(/(?:twitter|x)\.com\/([A-Za-z0-9_]{1,15})/)?.[1];
  return {
    avatar: p.avatar_url || DEFAULT_AVATAR,
    cover: p.cover_url || '',
    handle: p.handle ?? (fromX ? `@${fromX}` : ''),
    bio: p.bio ?? 'Software architect. I design mobile and web products that take payments.',
    company: p.company ?? p.role_title,
    joined: p.joined_text ?? 'Building since 2021',
    born: p.born_text ?? '', // stays off the site unless filled in
    verified: p.verified ?? true,
  };
}

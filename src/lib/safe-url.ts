// URLs typed into the admin end up in href/src attributes. Only allow web
// links, so a mistyped or malicious `javascript:` URL can never run.
export function safeUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed; // path on this site
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' || parsed.protocol === 'mailto:' ? trimmed : null;
  } catch {
    return null;
  }
}

// open.spotify.com/playlist/ID -> embeddable player URL (or null if it is not Spotify).
export function spotifyEmbedUrl(url: string | null | undefined): string | null {
  const safe = safeUrl(url);
  if (!safe) return null;
  try {
    const parsed = new URL(safe);
    if (parsed.hostname !== 'open.spotify.com') return null;
    const match = parsed.pathname.match(/^\/(playlist|album|track|artist|show|episode)\/([A-Za-z0-9]+)/);
    return match ? `https://open.spotify.com/embed/${match[1]}/${match[2]}` : null;
  } catch {
    return null;
  }
}

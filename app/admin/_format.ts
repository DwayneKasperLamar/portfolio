// Dates in the admin are written in the owner's own time zone.
export const ownerDate = (iso: string, zone: string) =>
  new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: zone }).format(new Date(iso));

export const ownerClock = (iso: string, zone: string) =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: zone }).format(new Date(iso));

export const ownerDay = (iso: string, zone: string) =>
  new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: zone }).format(new Date(iso));

/** A draft in the owner's own email app. Nothing is sent by the site. */
export const mailDraft = (email: string, subject: string, body = '') =>
  `mailto:${encodeURIComponent(email).replace('%40', '@')}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`;

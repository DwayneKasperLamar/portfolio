import type { CollectionItem, Profile } from '@/lib/content';
import { safeUrl } from '@/lib/safe-url';

// "dwayne@x.com", "github.com/name" -> what to show for a profile link.
const handleOf = (url: string) => url.replace(/\/+$/, '').split('/').pop() ?? url;

// Contact rows: what it is on the left, the address in the middle, an arrow on the right.
// On the web they sit inside the contrasting contact band, so the colours are reversed there.
// Main email from the profile; extra addresses or links from the public `contact` list.
const Contact = ({ profile, extra }: { profile: Profile; extra: CollectionItem[] }) => {
  const github = safeUrl(profile.github_url);
  const x = safeUrl(profile.twitter_url);
  const linkedin = safeUrl(profile.linkedin_url);
  const rows = [
    { key: 'email', label: 'Email', text: profile.email, url: safeUrl(`mailto:${profile.email}`) },
    ...extra.map((item) => ({
      key: item.id,
      label: item.url?.startsWith('mailto:') ? 'Email' : 'Link',
      text: item.title,
      url: safeUrl(item.url),
    })),
    { key: 'linkedin', label: 'LinkedIn', text: linkedin ? handleOf(linkedin) : '', url: linkedin },
    { key: 'github', label: 'GitHub', text: github ? handleOf(github) : '', url: github },
    { key: 'x', label: 'X', text: x ? `@${handleOf(x)}` : '', url: x },
  ];

  return (
    <ul>
      {rows.map(
        (row) =>
          row.url && (
            <li key={row.key} className="border-t border-line first:border-t-0 md:border-line-inverse md:first:border-t">
              <a
                href={row.url}
                {...(row.url.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noreferrer' })}
                className="grid grid-cols-[64px_minmax(0,1fr)_16px] items-center gap-3 py-3 text-sm hover:underline md:py-3.5">
                <span className="text-[12.5px] font-medium text-muted md:text-inverse-muted">{row.label}</span>
                <span className="text-primary [overflow-wrap:anywhere] md:text-inverse">{row.text}</span>
                <span aria-hidden className="text-muted md:text-inverse-muted">
                  &#8599;
                </span>
              </a>
            </li>
          ),
      )}
    </ul>
  );
};

export default Contact;

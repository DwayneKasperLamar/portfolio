import type { CollectionItem, Profile } from '@/lib/content';
import { safeUrl } from '@/lib/safe-url';
import Section from '@/components/Section';

const link = 'underline decoration-line hover:decoration-primary break-all';

// Main email from the profile; extra addresses or links from the public `contact` list.
const Contact = ({ profile, extra }: { profile: Profile; extra: CollectionItem[] }) => {
  const links = [
    { label: 'GitHub', url: safeUrl(profile.github_url) },
    { label: 'X', url: safeUrl(profile.twitter_url) },
  ];
  return (
    <Section title="Contact" id="contact">
      <p>
        Email{' '}
        <a href={`mailto:${profile.email}`} className={link}>
          {profile.email}
        </a>
        {extra.map((item) => {
          const url = safeUrl(item.url);
          return url ? (
            <span key={item.id}>
              {' '}
              or{' '}
              <a href={url} className={link}>
                {item.title}
              </a>
            </span>
          ) : null;
        })}
        .
      </p>
      <p className="mt-2 flex flex-wrap gap-x-4 font-mono text-xs">
        {links.map(
          (l) =>
            l.url && (
              <a key={l.label} href={l.url} target="_blank" rel="noreferrer" className="text-muted hover:text-primary">
                {l.label} &#8599;
              </a>
            ),
        )}
      </p>
    </Section>
  );
};

export default Contact;

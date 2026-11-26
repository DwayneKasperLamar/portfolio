/* eslint-disable @next/next/no-img-element -- photos are uploaded or linked in the admin */
import Link from 'next/link';
import { Briefcase, Cake, Calendar, Link2, MapPin } from 'lucide-react';
import type { Profile } from '@/lib/content';
import { DEFAULT_AVATAR, headerDetails } from '@/lib/profile-header';
import { safeUrl } from '@/lib/safe-url';
import { CoverButtons } from '@/components/HeaderButtons';

// Drawn background used until a background photo is uploaded: a small system diagram.
const Blueprint = () => (
  <svg viewBox="0 0 600 150" preserveAspectRatio="xMaxYMid slice" className="w-full h-full text-blueprint-ink" aria-hidden>
    <defs>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0H0V20" fill="none" stroke="currentColor" strokeOpacity="0.15" />
      </pattern>
    </defs>
    <rect width="600" height="150" fill="url(#grid)" />
    {(
      [
        [250, 30, 'app'],
        [340, 80, 'server'],
        [405, 28, 'payments'],
        [480, 100, 'data'],
      ] as const
    ).map(([x, y, name]) => (
      <g key={name}>
        <rect x={x} y={y} width="78" height="30" rx="5" fill="none" stroke="currentColor" />
        <text x={x + 39} y={y + 19} textAnchor="middle" fontSize="11" fontFamily="monospace" fill="currentColor">
          {name}
        </text>
      </g>
    ))}
    <path d="M328 45h51v35M418 95h62M398 80l40-22" fill="none" stroke="currentColor" strokeDasharray="4 4" />
  </svg>
);

const CheckBadge = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0 text-badge" role="img" aria-label="check badge">
    <path
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      d="M23.4 12L20.9 15.7 20.1 20.1 15.7 20.9 12 23.4 8.3 20.9 3.9 20.1 3.1 15.7.6 12 3.1 8.3 3.9 3.9 8.3 3.1 12 .6 15.7 3.1 20.1 3.9 20.9 8.3Z"
    />
    <path d="M7.5 12.3l3 3 6-6.2" fill="none" className="stroke-on-veil" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface MobileHeaderProps {
  profile: Profile;
  counts: { roles: number; caseStudies: number };
  owner: boolean; // logged in: "Edit profile" replaces "Email me"
}

// The profile header shown on phones only. Wider screens keep the simple text header.
const MobileHeader = ({ profile, counts, owner }: MobileHeaderProps) => {
  const d = headerDetails(profile);
  const avatar = safeUrl(d.avatar) ?? DEFAULT_AVATAR;
  const cover = safeUrl(d.cover);
  const github = safeUrl(profile.github_url);
  const action = 'flex items-center justify-center rounded-full border border-line py-2.5 text-sm font-semibold text-primary';

  const meta = [
    { icon: Briefcase, text: d.company },
    { icon: MapPin, text: profile.location },
    { icon: Calendar, text: d.joined },
    { icon: Cake, text: d.born && `Born ${d.born}` },
  ].filter((m) => m.text);

  const stats = [
    [counts.roles, counts.roles === 1 ? 'current role' : 'current roles'],
    [counts.caseStudies, counts.caseStudies === 1 ? 'case study' : 'case studies'],
  ].filter(([n]) => Number(n) > 0);

  return (
    <header className="md:hidden -mx-6 mb-8">
      <div className="relative h-[150px] bg-blueprint overflow-hidden">
        {cover ? <img src={cover} alt="" className="w-full h-full object-cover" /> : <Blueprint />}
        <CoverButtons title={profile.name} />
      </div>

      <div className="px-4">
        <div className="relative -mt-[46px] w-[92px] h-[92px] rounded-full border-4 border-base bg-surface overflow-hidden">
          <img
            src={avatar}
            alt={profile.name}
            // the starter photo is a tall portrait: keep the face in the circle
            className={`w-full h-full object-cover ${avatar === DEFAULT_AVATAR ? 'object-[50%_70%] scale-[1.35] origin-[43%_55%]' : ''}`}
          />
        </div>

        <h1 className="flex flex-wrap items-center gap-2 mt-2 text-2xl font-bold text-primary leading-tight">
          {profile.name}
          {d.verified && <CheckBadge />}
        </h1>
        {d.handle && <p className="font-mono text-sm text-muted">{d.handle}</p>}
        {d.bio && <p className="mt-2.5 text-[0.95rem]">{d.bio}</p>}

        {profile.now_text && (
          <p className="flex items-center gap-2 mt-2.5 font-mono text-xs text-primary">
            <span className="status-dot" />
            {profile.now_text}
          </p>
        )}

        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5 font-mono text-xs text-muted">
          {meta.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-1.5">
              <Icon size={14} aria-hidden />
              {text}
            </li>
          ))}
          {github && (
            <li className="flex items-center gap-1.5 min-w-0">
              <Link2 size={14} aria-hidden />
              <a href={github} target="_blank" rel="noreferrer" className="truncate hover:text-primary">
                {github.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </li>
          )}
        </ul>

        {stats.length > 0 && (
          <p className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5 text-sm text-muted">
            {stats.map(([n, label]) => (
              <span key={label}>
                <b className="text-primary">{n}</b> {label}
              </span>
            ))}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2.5 mt-3.5">
          <Link href="/cv" className={action}>
            View CV
          </Link>
          {owner ? (
            <Link href="/admin/profile" className={action}>
              Edit profile
            </Link>
          ) : (
            <a href={`mailto:${profile.email}`} className={action}>
              Email me
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;

/* eslint-disable @next/next/no-img-element -- photos are uploaded or linked in the admin */
import Link from 'next/link';
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

// The profile header shown on phones only. Wider screens keep the text header.
const MobileHeader = ({ profile, counts, owner }: MobileHeaderProps) => {
  const d = headerDetails(profile);
  const avatar = safeUrl(d.avatar) ?? DEFAULT_AVATAR;
  const cover = safeUrl(d.cover);

  // Two even columns of short facts.
  const facts = [
    d.company,
    profile.location,
    d.joined,
    counts.roles > 0 && `${counts.roles} current ${counts.roles === 1 ? 'role' : 'roles'}`,
    counts.caseStudies > 0 && `${counts.caseStudies} case ${counts.caseStudies === 1 ? 'study' : 'studies'}`,
    d.born && `Born ${d.born}`,
  ].filter((f): f is string => Boolean(f));

  return (
    <header className="pb-6 md:hidden">
      <div className="relative h-32 overflow-hidden bg-blueprint">
        {cover ? <img src={cover} alt="" className="h-full w-full object-cover" /> : <Blueprint />}
        <CoverButtons title={profile.name} />
      </div>

      <div className="grid gap-3.5 px-5">
        <div>
          <div className="relative -mt-11 h-[88px] w-[88px] overflow-hidden rounded-full border-4 border-base bg-surface">
            <img
              src={avatar}
              alt={profile.name}
              // the starter photo is a tall portrait: keep the face in the circle
              className={`h-full w-full object-cover ${avatar === DEFAULT_AVATAR ? 'object-[50%_70%] scale-[1.35] origin-[43%_55%]' : ''}`}
            />
          </div>
          <h1 className="mt-3 flex flex-wrap items-center gap-2 text-[27px] font-semibold leading-tight text-primary">
            {profile.name}
            {d.verified && <CheckBadge />}
          </h1>
          {d.handle && <p className="text-sm text-muted">{d.handle}</p>}
        </div>

        {d.bio && <p className="font-head text-[19px] font-medium leading-[1.4] text-primary [text-wrap:pretty]">{d.bio}</p>}

        {profile.now_text && (
          <div>
            <span className="pill">
              <span className="status-dot" />
              {profile.now_text}
            </span>
          </div>
        )}

        <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[13px] leading-snug text-muted">
          {facts.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>

        <div className="grid grid-cols-2 gap-2.5">
          {owner ? (
            <Link href="/admin/profile" className="btn btn-fill">
              Edit profile
            </Link>
          ) : (
            <a href={`mailto:${profile.email}`} className="btn btn-fill">
              Email me
            </a>
          )}
          <Link href="/cv" className="btn">
            View CV
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;

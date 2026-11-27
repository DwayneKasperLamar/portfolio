/* eslint-disable @next/next/no-img-element -- the photo is uploaded or linked in the admin */
import Link from 'next/link';
import EmailButton from '@/components/EmailButton';
import type { Profile } from '@/lib/content';
import { DEFAULT_AVATAR, headerDetails } from '@/lib/profile-header';
import { safeUrl } from '@/lib/safe-url';

// The opening of the web page: headline and buttons on the left, photo on the right.
const Hero = ({ profile, className = '' }: { profile: Profile; className?: string }) => {
  const { bio, avatar } = headerDetails(profile);
  const photo = safeUrl(avatar) ?? DEFAULT_AVATAR;
  // "About, second paragraph" in the admin; the standard line is used while it is empty.
  const lead =
    profile.previous_role_text ||
    `${profile.role_title}. I decide how it all fits together, direct AI coding agents to build it, and check what ships.`;

  return (
    <header className={`hidden px-10 md:block ${className}`}>
      <div className="mx-auto grid max-w-[1080px] grid-cols-[minmax(0,1fr)_240px] items-center gap-8 py-16 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-[72px] lg:py-[72px]">
        <div>
          {profile.now_text && (
            <span className="pill mb-[22px]">
              <span className="status-dot" />
              {profile.now_text}
            </span>
          )}
          <h1 className="text-[32px] font-semibold leading-[1.18] text-primary [text-wrap:pretty] lg:text-[46px]">{bio || profile.name}</h1>
          <p className="mt-5 max-w-[56ch] text-lg text-secondary">{lead}</p>
          <div className="mt-[30px] flex flex-wrap gap-2.5">
            <EmailButton email={profile.email} />
            <Link href="/cv" className="btn">
              View CV
            </Link>
          </div>
        </div>
        <div className="h-[320px] overflow-hidden rounded-[20px] border border-line bg-surface lg:h-[380px]">
          <img
            src={photo}
            alt={profile.name}
            className={`h-full w-full object-cover ${photo === DEFAULT_AVATAR ? 'object-[50%_66%] scale-[1.08] origin-[45%_60%]' : ''}`}
          />
        </div>
      </div>
    </header>
  );
};

export default Hero;

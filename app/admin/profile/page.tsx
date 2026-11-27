import ProfileEditor from './_ProfileEditor';
import { ExplainNote, PageHead } from '../_ui';
import { getProfile } from '@/lib/content';
import { requireOwner } from '@/lib/owner';
import { headerDetails } from '@/lib/profile-header';

export const dynamic = 'force-dynamic';

export default async function AdminProfilePage() {
  await requireOwner('/admin/profile');
  const profile = await getProfile();

  if (!profile) {
    return (
      <div>
        <PageHead title="Profile" />
        <p className="text-muted">
          No profile row yet &mdash; run the seed script (<code>npm run seed</code>) after Supabase credentials are set.
        </p>
      </div>
    );
  }

  // Boxes are pre-filled with what the site shows now, so Save never blanks something by accident.
  const header = headerDetails(profile);

  return (
    <ProfileEditor
      explain={<ExplainNote>Who you are on the public site. Everything on this screen can be seen by anyone.</ExplainNote>}
      has={{ header: profile.avatar_url !== undefined, linkedin: profile.linkedin_url !== undefined }}
      verified={header.verified}
      initial={{
        name: profile.name,
        role_title: profile.role_title,
        current_role_text: profile.current_role_text,
        previous_role_text: profile.previous_role_text,
        now_text: profile.now_text,
        email: profile.email,
        github_url: profile.github_url,
        twitter_url: profile.twitter_url,
        linkedin_url: profile.linkedin_url ?? '',
        handle: header.handle,
        bio: header.bio,
        company: header.company,
        joined_text: header.joined,
        born_text: header.born,
        avatar_url: header.avatar,
      }}
    />
  );
}

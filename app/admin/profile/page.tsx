import { getProfile } from '@/lib/content';
import { updateProfile } from '../actions';
import MediaField from '../_MediaField';
import { headerDetails } from '@/lib/profile-header';

export const dynamic = 'force-dynamic';

const fieldClass = 'w-full bg-surface-alt border border-line rounded px-3 py-2 text-primary placeholder:text-muted focus:outline-none';
const labelClass = 'text-xs uppercase tracking-wide text-muted mb-1 block';

export default async function AdminProfilePage() {
  const profile = await getProfile();

  return (
    <div>
      <h1 className="text-lg font-semibold text-primary mb-6">Profile</h1>
      {!profile ? (
        <p className="text-muted text-sm">
          No profile row yet &mdash; run the seed script (<code>npm run seed</code>) after Supabase credentials are set.
        </p>
      ) : (
        <form action={updateProfile} className="flex flex-col gap-4">
          <label>
            <span className={labelClass}>Name</span>
            <input name="name" defaultValue={profile.name} className={fieldClass} />
          </label>
          <label>
            <span className={labelClass}>Location</span>
            <input name="location" defaultValue={profile.location} className={fieldClass} />
          </label>
          <label>
            <span className={labelClass}>Role title</span>
            <input name="role_title" defaultValue={profile.role_title} className={fieldClass} />
          </label>
          <label>
            <span className={labelClass}>About (shown near the bottom of the home page)</span>
            <textarea name="current_role_text" defaultValue={profile.current_role_text} rows={3} className={fieldClass} />
          </label>
          <label>
            <span className={labelClass}>Web: the line under the headline (empty = the standard line)</span>
            <textarea name="previous_role_text" defaultValue={profile.previous_role_text} rows={3} className={fieldClass} />
          </label>
          <label>
            <span className={labelClass}>Availability line (for example Open to remote roles)</span>
            <textarea name="now_text" defaultValue={profile.now_text} rows={3} className={fieldClass} />
          </label>
          <label>
            <span className={labelClass}>Email</span>
            <input name="email" defaultValue={profile.email} className={fieldClass} />
          </label>
          <label>
            <span className={labelClass}>GitHub URL</span>
            <input name="github_url" defaultValue={profile.github_url} className={fieldClass} />
          </label>
          <label>
            <span className={labelClass}>Twitter URL</span>
            <input name="twitter_url" defaultValue={profile.twitter_url} className={fieldClass} />
          </label>
          {/* These columns exist after supabase/003_profile_and_media.sql has been run. */}
          {profile.avatar_url !== undefined && (
            <>
              <p className="text-sm text-muted border border-dashed border-line rounded px-3 py-2">
                Header details. The headline shows on phone and web; photos and the rest on phones. Everything here is public. Leave &ldquo;Born&rdquo; empty to keep your birthday off the site.
              </p>
              <MediaField name="avatar_url" label="Profile photo" defaultValue={headerDetails(profile).avatar} imagesOnly />
              <MediaField name="cover_url" label="Background photo" defaultValue={profile.cover_url} imagesOnly />
              {(
                [
                  ['handle', 'handle', 'Handle (for example @yourname)'],
                  ['bio', 'bio', 'Headline: your one-line promise (phone and web)'],
                  ['company', 'company', 'Work line (for example Software architect)'],
                  ['joined_text', 'joined', 'Joined line (for example Building since 2021)'],
                  ['born_text', 'born', 'Born (optional, public)'],
                ] as const
              ).map(([key, shown, label]) => (
                <label key={key}>
                  <span className={labelClass}>{label}</span>
                  <input name={key} defaultValue={headerDetails(profile)[shown]} className={fieldClass} />
                </label>
              ))}
              <label className="flex items-center gap-2 text-sm text-primary">
                <input type="checkbox" name="verified" defaultChecked={headerDetails(profile).verified} />
                Show the check badge beside my name (decoration, not an official verification)
              </label>
            </>
          )}
          <button type="submit" className="self-start bg-surface-alt border border-line rounded px-4 py-2 text-primary hover:border-muted transition-colors">
            Save
          </button>
        </form>
      )}
    </div>
  );
}

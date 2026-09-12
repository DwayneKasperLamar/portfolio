import { getProfile } from '@/lib/content';
import { updateProfile } from '../actions';

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
            <span className={labelClass}>Current role paragraph</span>
            <textarea name="current_role_text" defaultValue={profile.current_role_text} rows={3} className={fieldClass} />
          </label>
          <label>
            <span className={labelClass}>Previous role paragraph</span>
            <textarea name="previous_role_text" defaultValue={profile.previous_role_text} rows={3} className={fieldClass} />
          </label>
          <label>
            <span className={labelClass}>&ldquo;Now&rdquo; paragraph</span>
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
          <button type="submit" className="self-start bg-surface-alt border border-line rounded px-4 py-2 text-primary hover:border-muted transition-colors">
            Save
          </button>
        </form>
      )}
    </div>
  );
}

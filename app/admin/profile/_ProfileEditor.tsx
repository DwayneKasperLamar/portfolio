'use client';

/* eslint-disable @next/next/no-img-element -- admin preview of the uploaded photo */
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateProfile } from '../actions';
import MediaField from '../_MediaField';
import { PageHead, btnClass, btnFillClass, cardClass, fieldClass, labelClass } from '../_ui';

export type ProfileValues = Record<
  | 'name' | 'role_title' | 'current_role_text' | 'previous_role_text' | 'now_text' | 'email' | 'github_url' | 'twitter_url' | 'linkedin_url'
  | 'handle' | 'bio' | 'company' | 'joined_text' | 'born_text' | 'avatar_url',
  string
>;

interface Props {
  initial: ProfileValues;
  verified: boolean;
  explain: React.ReactNode;
  /** False until the database has the columns (scripts 003 and 005). */
  has: { header: boolean; linkedin: boolean };
}

function Save() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={btnFillClass}>
      {pending ? 'Saving…' : 'Save changes'}
    </button>
  );
}

export default function ProfileEditor({ initial, verified, explain, has }: Props) {
  const [v, setV] = useState(initial);
  const [badge, setBadge] = useState(verified);
  const [saved, setSaved] = useState(false);
  const set = useCallback((key: keyof ProfileValues, value: string) => {
    setV((old) => (old[key] === value ? old : { ...old, [key]: value }));
  }, []);
  const setPhoto = useCallback((value: string) => set('avatar_url', value), [set]);

  const field = (key: keyof ProfileValues, label: string, max: number, rows?: number, hint?: string) => {
    const shared = {
      name: key,
      value: v[key],
      maxLength: max,
      placeholder: hint,
      className: fieldClass,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSaved(false);
        set(key, e.target.value);
      },
    };
    return (
      <label>
        <span className={labelClass}>{label}</span>
        {rows ? <textarea rows={rows} {...shared} /> : <input {...shared} />}
      </label>
    );
  };

  return (
    <form
      action={async (formData) => {
        await updateProfile(formData);
        setSaved(true);
      }}>
      <PageHead title="Profile">
        {saved && <span role="status" className="text-[13px] text-muted">Saved</span>}
        <Link href="/" className={btnClass}>View site</Link>
        <Save />
      </PageHead>
      {explain}

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-4">
          <section className={cardClass}>
            <h2 className="font-semibold text-primary">You</h2>
            {has.header && <MediaField name="avatar_url" label="Profile photo" defaultValue={initial.avatar_url} imagesOnly onValueChange={setPhoto} />}
            <div className="grid gap-3 sm:grid-cols-2">
              {field('name', 'Name', 200)}
              {field('role_title', 'Role title', 200)}
              {has.header && field('handle', 'Handle', 200, undefined, '@yourname')}
              {has.header && field('joined_text', 'Joined line', 200, undefined, 'Building since 2021')}
              {has.header && field('born_text', 'Born (optional, public)', 200, undefined, 'Empty = not shown')}
            </div>
            {has.header && (
              <label className="flex items-center gap-2 text-sm text-primary">
                <input type="checkbox" name="verified" checked={badge} onChange={(e) => setBadge(e.target.checked)} />
                Show the check badge beside my name (decoration, not an official verification)
              </label>
            )}
          </section>

          <section className={cardClass}>
            <h2 className="font-semibold text-primary">Words</h2>
            {has.header && field('bio', 'Headline: your one-line promise', 1000, 2)}
            {field('current_role_text', 'About (near the bottom of the home page)', 100000, 4)}
            {field('previous_role_text', 'Web: the line under the headline (empty = the standard line)', 100000, 3)}
            <div className="grid gap-3 sm:grid-cols-2">
              {field('now_text', 'Availability line', 200, undefined, 'Open to remote roles')}
              {has.header && field('company', 'Work line (phones)', 200)}
            </div>
          </section>

          <section className={cardClass}>
            <h2 className="font-semibold text-primary">Links</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {field('email', 'Email (public)', 200)}
              {field('github_url', 'GitHub', 2000, undefined, 'https://github.com/…')}
              {field('twitter_url', 'X', 2000, undefined, 'https://x.com/…')}
              {has.linkedin && field('linkedin_url', 'LinkedIn', 2000, undefined, 'https://www.linkedin.com/in/…')}
            </div>
          </section>
        </div>

        {/* A rough picture of the phone page, updated as you type. */}
        <aside aria-label="Phone preview" className="sticky top-[84px] mx-auto hidden w-[320px] gap-2.5 overflow-hidden rounded-[34px] border-8 border-primary bg-base px-[18px] pb-7 pt-6 xl:grid">
          {v.avatar_url && <img src={v.avatar_url} alt="" className="h-[70px] w-[70px] rounded-full border border-line object-cover" />}
          <p className="font-head text-[21px] font-semibold leading-tight text-primary [overflow-wrap:anywhere]">
            {v.name}
            {badge && has.header && <span aria-hidden className="ml-1.5 text-badge">&#10004;</span>}
          </p>
          <p className="text-[13px] text-muted [overflow-wrap:anywhere]">{[v.handle, v.company || v.role_title].filter(Boolean).join(' · ')}</p>
          {v.bio && <p className="font-head text-[15px] leading-snug text-primary [overflow-wrap:anywhere]">{v.bio}</p>}
          {v.now_text && (
            <span className="pill w-fit">
              <span className="status-dot" />
              {v.now_text}
            </span>
          )}
          <p className="line-clamp-6 text-[13px] text-secondary [overflow-wrap:anywhere]">{v.current_role_text}</p>
        </aside>
      </div>
    </form>
  );
}

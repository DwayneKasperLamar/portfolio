import type { Visibility } from '@/lib/content';
import ContentTabs from './_ContentTabs';

export const fieldClass =
  'w-full bg-surface-alt border border-line rounded-lg px-3 py-2 text-primary placeholder:text-muted focus:outline-none focus:border-muted';
export const labelClass = 'text-xs uppercase tracking-wide text-muted mb-1 block';
export const cardClass = 'flex flex-col gap-3 border border-line rounded-xl p-4 bg-surface';
export const saveClass =
  'self-start bg-surface-alt border border-line rounded-lg px-4 py-2 text-primary hover:border-muted transition-colors';
// Lists of editable things sit in a grid on wide screens.
export const gridClass = 'grid items-start gap-4 xl:grid-cols-2';

// Buttons: the main action is filled, everything else outlined.
export const btnClass =
  'inline-flex h-[38px] items-center justify-center gap-2 rounded-[9px] border border-line bg-surface px-4 text-[13px] font-semibold text-primary transition-colors hover:border-muted disabled:opacity-60';
export const btnFillClass =
  'inline-flex h-[38px] items-center justify-center gap-2 rounded-[9px] border border-primary bg-primary px-4 text-[13px] font-semibold text-inverse transition-colors hover:bg-secondary disabled:opacity-60';
export const smallClass = 'rounded-lg border border-line px-3 py-1.5 text-xs text-primary hover:border-muted';
export const deleteClass = 'text-xs text-muted underline hover:text-primary';

// Plain-words note at the top of each admin screen (same habit as the other projects).
export function ExplainNote({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted border border-dashed border-line rounded-lg px-3 py-2 mb-5">{children}</p>;
}

// The bar that stays at the top of a screen: its name on the left, its actions on the right.
export function PageHead({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-30 -mx-4 mb-5 flex min-h-[67px] flex-wrap items-center gap-3 border-b border-line bg-base px-4 py-3 md:-mx-7 md:px-7">
        <h1 className="text-[26px] font-semibold leading-tight text-primary">{title}</h1>
        {children && <div className="ml-auto flex flex-wrap items-center gap-2">{children}</div>}
      </header>
      <ContentTabs />
    </>
  );
}

export function VisibilitySelect({ value = 'private' }: { value?: Visibility }) {
  return (
    <label>
      <span className={labelClass}>Who can see this</span>
      <select name="visibility" defaultValue={value} className={fieldClass}>
        <option value="private">Private — only me (after login)</option>
        <option value="public">Public — anyone on the internet</option>
      </select>
    </label>
  );
}

export function VisibilityBadge({ value }: { value: Visibility }) {
  return (
    <span className={value === 'public' ? 'pill' : 'pill border-dashed !text-muted'}>
      {value === 'public' && <span className="status-dot" />}
      {value}
    </span>
  );
}

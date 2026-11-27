import type { Visibility } from '@/lib/content';

export const fieldClass =
  'w-full bg-surface-alt border border-line rounded-lg px-3 py-2 text-primary placeholder:text-muted focus:outline-none focus:border-muted';
export const labelClass = 'text-xs uppercase tracking-wide text-muted mb-1 block';
export const cardClass = 'flex flex-col gap-3 border border-line rounded-xl p-4 bg-surface';
export const saveClass =
  'self-start bg-surface-alt border border-line rounded-lg px-4 py-2 text-primary hover:border-muted transition-colors';
// Lists of editable things sit in a grid on wide screens.
export const gridClass = 'grid items-start gap-4 xl:grid-cols-2';

// Plain-words note at the top of each admin screen (same habit as the other projects).
export function ExplainNote({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted border border-dashed border-line rounded-lg px-3 py-2 mb-6">{children}</p>;
}

export function PageHead({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <h1 className="text-[28px] font-semibold leading-tight text-primary">{title}</h1>
      {children}
    </div>
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

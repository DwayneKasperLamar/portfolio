import type { Visibility } from '@/lib/content';

export const fieldClass =
  'w-full bg-surface-alt border border-line rounded px-3 py-2 text-primary placeholder:text-muted focus:outline-none';
export const labelClass = 'text-xs uppercase tracking-wide text-muted mb-1 block';
export const cardClass = 'flex flex-col gap-3 border border-line rounded-lg p-4';
export const saveClass =
  'self-start bg-surface-alt border border-line rounded px-4 py-2 text-primary hover:border-muted transition-colors';

// Plain-words note at the top of each admin screen (same habit as the other projects).
export function ExplainNote({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted border border-dashed border-line rounded px-3 py-2 mb-6">{children}</p>;
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
    <span className={`font-mono text-xs ${value === 'public' ? 'text-green-500' : 'text-muted'}`}>
      {value === 'public' ? 'public' : 'private'}
    </span>
  );
}

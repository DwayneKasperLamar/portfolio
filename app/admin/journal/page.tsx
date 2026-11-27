import { getOwnerJournal } from '@/lib/content';
import type { JournalEntry } from '@/lib/content';
import { upsertJournalEntry, deleteJournalEntry } from '../actions';
import { ExplainNote, VisibilitySelect, VisibilityBadge, fieldClass, labelClass, cardClass, saveClass } from '../_ui';

export const dynamic = 'force-dynamic';

function JournalForm({ entry }: { entry?: JournalEntry }) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <form action={upsertJournalEntry} className={cardClass}>
      <label>
        <span className={labelClass}>Title</span>
        <input name="title" defaultValue={entry?.title} required className={fieldClass} />
      </label>
      <label>
        <span className={labelClass}>Slug (the web address; leave blank to make one from the title)</span>
        <input name="slug" defaultValue={entry?.slug} readOnly={!!entry} className={fieldClass} />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label>
          <span className={labelClass}>Date</span>
          <input name="entry_date" type="date" defaultValue={entry?.entry_date ?? today} required className={fieldClass} />
        </label>
        <label>
          <span className={labelClass}>Mood (optional)</span>
          <input name="mood" defaultValue={entry?.mood ?? ''} className={fieldClass} />
        </label>
      </div>
      <label>
        <span className={labelClass}>Entry (blank line = new paragraph)</span>
        <textarea name="body" defaultValue={entry?.body} rows={10} className={fieldClass} />
      </label>
      <label>
        <span className={labelClass}>Tags (comma separated)</span>
        <input name="tags" defaultValue={entry?.tags.join(', ')} className={fieldClass} />
      </label>
      <VisibilitySelect value={entry?.visibility} />
      <button type="submit" className={saveClass}>
        {entry ? 'Save' : 'Add entry'}
      </button>
    </form>
  );
}

export default async function AdminJournalPage() {
  const entries = await getOwnerJournal();

  return (
    <div>
      <h1 className="text-lg font-semibold text-primary mb-2">Journal</h1>
      <ExplainNote>
        Your diary. Every entry is private until you switch it to public. Private entries are only readable at /private after you log in.
      </ExplainNote>

      <h2 className="text-sm font-semibold text-primary mb-3">New entry</h2>
      <div className="mb-10 max-w-2xl">
        <JournalForm />
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-2 [&>details]:rounded-xl [&>details]:border [&>details]:border-line [&>details]:p-3">
        {entries.map((entry) => (
          <details key={entry.slug} className="group">
            <summary className="cursor-pointer text-sm text-primary mb-2 flex gap-3 items-baseline">
              <span className="font-mono text-xs text-muted">{entry.entry_date}</span>
              {entry.title}
              <VisibilityBadge value={entry.visibility} />
            </summary>
            <JournalForm entry={entry} />
            <form action={deleteJournalEntry} className="mt-2">
              <input type="hidden" name="slug" value={entry.slug} />
              <button type="submit" className="text-xs text-red-500 hover:underline">
                Delete &ldquo;{entry.title}&rdquo;
              </button>
            </form>
          </details>
        ))}
      </div>
    </div>
  );
}

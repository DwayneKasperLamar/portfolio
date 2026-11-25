import { getOwnerTimeline } from '@/lib/content';
import type { TimelineEvent } from '@/lib/content';
import { upsertTimelineEvent, deleteTimelineEvent } from '../actions';
import { ExplainNote, VisibilitySelect, VisibilityBadge, fieldClass, labelClass, cardClass, saveClass } from '../_ui';

export const dynamic = 'force-dynamic';

function EventForm({ event }: { event?: TimelineEvent }) {
  return (
    <form action={upsertTimelineEvent} className={cardClass}>
      <input type="hidden" name="id" value={event?.id ?? ''} />
      <div className="grid grid-cols-2 gap-3">
        <label>
          <span className={labelClass}>Date (2019, 2019-06 or 2019-06-12)</span>
          <input name="event_date" defaultValue={event?.event_date} required placeholder="2019-06" className={fieldClass} />
        </label>
        <label>
          <span className={labelClass}>Category (life, work, school, travel...)</span>
          <input name="category" defaultValue={event?.category ?? 'life'} className={fieldClass} />
        </label>
      </div>
      <label>
        <span className={labelClass}>Title</span>
        <input name="title" defaultValue={event?.title} required className={fieldClass} />
      </label>
      <label>
        <span className={labelClass}>What happened (blank line = new paragraph)</span>
        <textarea name="body" defaultValue={event?.body} rows={5} className={fieldClass} />
      </label>
      <label>
        <span className={labelClass}>Photo URL (optional)</span>
        <input name="image_url" defaultValue={event?.image_url ?? ''} className={fieldClass} />
      </label>
      <VisibilitySelect value={event?.visibility} />
      <button type="submit" className={saveClass}>
        {event ? 'Save' : 'Add to timeline'}
      </button>
    </form>
  );
}

export default async function AdminTimelinePage() {
  const events = await getOwnerTimeline();

  return (
    <div>
      <h1 className="text-lg font-semibold text-primary mb-2">Timeline</h1>
      <ExplainNote>
        The biography, one moment at a time. The public Story page shows only the moments marked public, oldest first.
      </ExplainNote>

      <h2 className="text-sm font-semibold text-primary mb-3">New moment</h2>
      <div className="mb-10">
        <EventForm />
      </div>

      <div className="flex flex-col gap-6">
        {[...events].reverse().map((event) => (
          <details key={event.id}>
            <summary className="cursor-pointer text-sm text-primary mb-2 flex gap-3 items-baseline">
              <span className="font-mono text-xs text-muted">{event.event_date}</span>
              {event.title}
              <VisibilityBadge value={event.visibility} />
            </summary>
            <EventForm event={event} />
            <form action={deleteTimelineEvent} className="mt-2">
              <input type="hidden" name="id" value={event.id} />
              <button type="submit" className="text-xs text-red-500 hover:underline">
                Delete &ldquo;{event.title}&rdquo;
              </button>
            </form>
          </details>
        ))}
      </div>
    </div>
  );
}

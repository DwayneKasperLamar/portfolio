import { getOwnerPages } from '@/lib/content';
import type { SitePage } from '@/lib/content';
import { upsertPage, deletePage } from '../actions';
import { ExplainNote, VisibilitySelect, VisibilityBadge, fieldClass, labelClass, cardClass, saveClass } from '../_ui';

export const dynamic = 'force-dynamic';

function PageForm({ page }: { page?: SitePage }) {
  return (
    <form action={upsertPage} className={cardClass}>
      <label>
        <span className={labelClass}>Title</span>
        <input name="title" defaultValue={page?.title} required className={fieldClass} />
      </label>
      <label>
        <span className={labelClass}>Slug (the web address; leave blank to make one from the title)</span>
        <input name="slug" defaultValue={page?.slug} readOnly={!!page} className={fieldClass} />
      </label>
      <label>
        <span className={labelClass}>Text (blank line = new paragraph)</span>
        <textarea name="body" defaultValue={page?.body} rows={10} className={fieldClass} />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="flex items-center gap-2 text-sm text-primary">
          <input type="checkbox" name="show_in_nav" defaultChecked={page?.show_in_nav ?? true} />
          Show in the menu
        </label>
        <label>
          <span className={labelClass}>Menu order</span>
          <input name="nav_order" type="number" defaultValue={page?.nav_order ?? 0} className={fieldClass} />
        </label>
      </div>
      <VisibilitySelect value={page?.visibility} />
      <button type="submit" className={saveClass}>
        {page ? 'Save' : 'Add page'}
      </button>
    </form>
  );
}

export default async function AdminPagesPage() {
  const pages = await getOwnerPages();

  return (
    <div>
      <h1 className="text-lg font-semibold text-primary mb-2">Pages</h1>
      <ExplainNote>
        Free-form pages (About, Manifesto, Now, anything). A public page lives at /p/slug; a private one is only readable after login.
      </ExplainNote>

      <h2 className="text-sm font-semibold text-primary mb-3">New page</h2>
      <div className="mb-10 max-w-2xl">
        <PageForm />
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-2 [&>details]:rounded-xl [&>details]:border [&>details]:border-line [&>details]:p-3">
        {pages.map((page) => (
          <details key={page.slug}>
            <summary className="cursor-pointer text-sm text-primary mb-2 flex gap-3 items-baseline">
              {page.title}
              <VisibilityBadge value={page.visibility} />
            </summary>
            <PageForm page={page} />
            <form action={deletePage} className="mt-2">
              <input type="hidden" name="slug" value={page.slug} />
              <button type="submit" className="text-xs text-red-500 hover:underline">
                Delete &ldquo;{page.title}&rdquo;
              </button>
            </form>
          </details>
        ))}
      </div>
    </div>
  );
}

import { getTechItems, getProjects } from '@/lib/content';
import type { TechItem, Project } from '@/lib/content';
import { upsertTechItem, deleteTechItem } from '../actions';

export const dynamic = 'force-dynamic';

const fieldClass = 'w-full bg-surface-alt border border-line rounded px-3 py-2 text-primary placeholder:text-muted focus:outline-none';
const labelClass = 'text-xs uppercase tracking-wide text-muted mb-1 block';

function TechForm({ item, projects }: { item?: TechItem; projects: Project[] }) {
  return (
    <form action={upsertTechItem} className="flex flex-col gap-3 border border-line rounded-lg p-4">
      <input type="hidden" name="id" value={item?.id ?? ''} />
      <label>
        <span className={labelClass}>Label</span>
        <input name="label" defaultValue={item?.label} required className={fieldClass} />
      </label>
      <label>
        <span className={labelClass}>Icon key (Simple Icons slug, e.g. nextdotjs, python, react)</span>
        <input name="icon_key" defaultValue={item?.icon_key} required className={fieldClass} />
      </label>
      <label>
        <span className={labelClass}>Category</span>
        <select name="category" defaultValue={item?.category ?? 'stack'} className={fieldClass}>
          <option value="stack">Stack (built with)</option>
          <option value="skill">Skill / interest</option>
        </select>
      </label>
      <label>
        <span className={labelClass}>Linked project (shows its logo beside this icon)</span>
        <select name="project_slug" defaultValue={item?.project_slug ?? ''} className={fieldClass}>
          <option value="">None</option>
          {projects.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.title}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className={labelClass}>Sort order</span>
        <input name="sort_order" type="number" defaultValue={item?.sort_order ?? 0} className={fieldClass} />
      </label>
      <button type="submit" className="self-start bg-surface-alt border border-line rounded px-4 py-2 text-primary hover:border-muted transition-colors">
        {item ? 'Save' : 'Add tech item'}
      </button>
    </form>
  );
}

export default async function AdminTechPage() {
  const [items, projects] = await Promise.all([getTechItems(), getProjects()]);

  return (
    <div>
      <h1 className="text-lg font-semibold text-primary mb-6">Tech items</h1>
      <div className="flex flex-col gap-6 mb-10">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col gap-2">
            <TechForm item={item} projects={projects} />
            <form action={deleteTechItem}>
              <input type="hidden" name="id" value={item.id} />
              <button type="submit" className="text-xs text-red-500 hover:underline">
                Delete {item.label}
              </button>
            </form>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-primary mb-3">Add a tech item</h2>
      <TechForm projects={projects} />
    </div>
  );
}

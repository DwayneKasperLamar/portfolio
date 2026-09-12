import { getProjects } from '@/lib/content';
import { upsertProject, deleteProject } from '../actions';
import type { Project } from '@/lib/content';

export const dynamic = 'force-dynamic';

const fieldClass = 'w-full bg-surface-alt border border-line rounded px-3 py-2 text-primary placeholder:text-muted focus:outline-none';
const labelClass = 'text-xs uppercase tracking-wide text-muted mb-1 block';

function ProjectForm({ project }: { project?: Project }) {
  return (
    <form action={upsertProject} className="flex flex-col gap-3 border border-line rounded-lg p-4">
      <label>
        <span className={labelClass}>Slug (unique, used in URLs)</span>
        <input name="slug" defaultValue={project?.slug} required readOnly={!!project} className={fieldClass} />
      </label>
      <label>
        <span className={labelClass}>Title</span>
        <input name="title" defaultValue={project?.title} required className={fieldClass} />
      </label>
      <label>
        <span className={labelClass}>Description</span>
        <textarea name="description" defaultValue={project?.description} rows={2} required className={fieldClass} />
      </label>
      <label>
        <span className={labelClass}>Link (href)</span>
        <input name="href" defaultValue={project?.href} required className={fieldClass} />
      </label>
      <label>
        <span className={labelClass}>Logo URL</span>
        <input name="logo_url" defaultValue={project?.logo_url ?? ''} className={fieldClass} />
      </label>
      <label>
        <span className={labelClass}>Sort order</span>
        <input name="sort_order" type="number" defaultValue={project?.sort_order ?? 0} className={fieldClass} />
      </label>
      <button type="submit" className="self-start bg-surface-alt border border-line rounded px-4 py-2 text-primary hover:border-muted transition-colors">
        {project ? 'Save' : 'Add project'}
      </button>
    </form>
  );
}

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <h1 className="text-lg font-semibold text-primary mb-6">Projects</h1>
      <div className="flex flex-col gap-6 mb-10">
        {projects.map((project) => (
          <div key={project.slug} className="flex flex-col gap-2">
            <ProjectForm project={project} />
            <form action={deleteProject}>
              <input type="hidden" name="slug" value={project.slug} />
              <button type="submit" className="text-xs text-red-500 hover:underline">
                Delete {project.title}
              </button>
            </form>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-primary mb-3">Add a project</h2>
      <ProjectForm />
    </div>
  );
}

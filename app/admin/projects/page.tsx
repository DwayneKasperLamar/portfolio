import { getOwnerProjects } from '@/lib/content';
import { VisibilitySelect, VisibilityBadge, PageHead, deleteClass, ExplainNote } from '../_ui';
import ConfirmButton from '../_ConfirmButton';
import { upsertProject, deleteProject } from '../actions';
import MediaField from '../_MediaField';
import type { Project } from '@/lib/content';
import { requireOwner } from '@/lib/owner';

export const dynamic = 'force-dynamic';

const fieldClass = 'w-full bg-surface-alt border border-line rounded px-3 py-2 text-primary placeholder:text-muted focus:outline-none';
const labelClass = 'text-xs uppercase tracking-wide text-muted mb-1 block';

function ProjectForm({ project, withVisibility }: { project?: Project; withVisibility: boolean }) {
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
        <span className={labelClass}>Link (leave empty if the site is down)</span>
        <input name="href" defaultValue={project?.href} className={fieldClass} />
      </label>
      <MediaField name="logo_url" label="Logo" defaultValue={project?.logo_url} imagesOnly />
      <label>
        <span className={labelClass}>Sort order</span>
        <input name="sort_order" type="number" defaultValue={project?.sort_order ?? 0} className={fieldClass} />
      </label>
      {withVisibility && <VisibilitySelect value={project?.visibility ?? 'public'} />}
      <button type="submit" className="self-start bg-surface-alt border border-line rounded px-4 py-2 text-primary hover:border-muted transition-colors">
        {project ? 'Save' : 'Add project'}
      </button>
    </form>
  );
}

export default async function AdminProjectsPage() {
  await requireOwner();
  const projects = await getOwnerProjects();
  // The visibility column only exists after supabase/002_content_model.sql has been run.
  const withVisibility = projects.length === 0 || projects.some((p) => p.visibility !== undefined);

  return (
    <div>
      <PageHead title="Projects" />
      <ExplainNote>The projects listed on your About me page. Each one is private until you mark it public.</ExplainNote>
      <div className="grid items-start gap-5 mb-10 lg:grid-cols-2">
        {projects.map((project) => (
          <div key={project.slug} className="flex flex-col gap-2">
            {project.visibility && <VisibilityBadge value={project.visibility} />}
            <ProjectForm project={project} withVisibility={withVisibility} />
            <form action={deleteProject}>
              <input type="hidden" name="slug" value={project.slug} />
              <ConfirmButton question={`Delete ${project.title}?`} className={deleteClass}>
                Delete {project.title}
              </ConfirmButton>
            </form>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-primary mb-3">Add a project</h2>
      <ProjectForm withVisibility={withVisibility} />
    </div>
  );
}

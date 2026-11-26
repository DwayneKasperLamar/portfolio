import type { Project, TechItem } from '@/lib/content';
import SafeImage from '@/components/SafeImage';

// Phone version of the floating side logos (which need a wide screen): the same logos,
// large, in a grid.
const StackIcons = ({ items, projects }: { items: TechItem[]; projects: Project[] }) => (
  <ul className="grid grid-cols-4 gap-x-3 gap-y-4 md:hidden">
    {items.map((item) => {
      const project = projects.find((p) => p.slug === item.project_slug);
      const tile = (
        <>
          <span className="flex items-center justify-center w-16 h-16 rounded-2xl bg-chip border border-line">
            <SafeImage src={`https://cdn.simpleicons.org/${item.icon_key}`} alt="" width={40} height={40} />
          </span>
          <span className="font-mono text-[0.68rem] text-muted text-center leading-tight">{item.label}</span>
        </>
      );
      return (
        <li key={item.id} className="min-w-0">
          {project?.href ? (
            <a href={project.href} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1.5">
              {tile}
            </a>
          ) : (
            <span className="flex flex-col items-center gap-1.5">{tile}</span>
          )}
        </li>
      );
    })}
  </ul>
);

export default StackIcons;

import type { Project, TechItem } from '@/lib/content';
import SafeImage from '@/components/SafeImage';

// The tool logos, large and still, in an even grid (the caller picks the columns).
// A logo linked to a project with a working address opens it.
const ToolTiles = ({ items, projects, className = '' }: { items: TechItem[]; projects: Project[]; className?: string }) => (
  <ul className={`grid gap-x-2.5 gap-y-3.5 ${className}`}>
    {items.map((item) => {
      const href = projects.find((p) => p.slug === item.project_slug)?.href;
      const tile = (
        <>
          <span className="flex h-12 w-12 items-center justify-center rounded-[14px] border border-line bg-chip transition-transform group-hover:-translate-y-0.5 lg:h-[52px] lg:w-[52px]">
            <SafeImage src={`https://cdn.simpleicons.org/${item.icon_key}`} alt="" width={28} height={28} />
          </span>
          <span className="text-center text-[11px] leading-tight text-muted">{item.label}</span>
        </>
      );
      return (
        <li key={item.id} className="min-w-0">
          {href ? (
            <a href={href} target="_blank" rel="noreferrer" className="group flex flex-col items-center gap-1.5">
              {tile}
            </a>
          ) : (
            <span className="group flex flex-col items-center gap-1.5">{tile}</span>
          )}
        </li>
      );
    })}
  </ul>
);

export default ToolTiles;

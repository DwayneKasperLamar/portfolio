import type { Project, TechItem } from '@/lib/content';
import Section from '@/components/Section';
import StackIcons from '@/components/StackIcons';

// Phone: big logo grid. Web: a short text line (the logos float at the side there).
const Tools = ({ items, projects }: { items: TechItem[]; projects: Project[] }) => {
  if (items.length === 0) return null;
  return (
    <Section title="Tools">
      <StackIcons items={items} projects={projects} />
      <p className="hidden md:flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {items.map((item) => (
          <span key={item.id}>{item.label}</span>
        ))}
      </p>
    </Section>
  );
};

export default Tools;

'use client';

import { Canvas } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import type { TechItem, Project } from '@/lib/content';

interface TechIconRailProps {
  items: TechItem[];
  projects: Project[];
}

const TechIconRail = ({ items, projects }: TechIconRailProps) => {
  if (items.length === 0) return null;

  return (
    <div className="hidden lg:block fixed inset-y-0 right-0 w-40 pointer-events-none z-0" aria-hidden>
      <Canvas camera={{ position: [0, 0, 10], fov: 40 }}>
        <ambientLight intensity={1} />
        {items.map((item, index) => {
          const project = item.project_slug ? projects.find((p) => p.slug === item.project_slug) : undefined;
          const spread = 8;
          const y = items.length > 1 ? spread / 2 - index * (spread / (items.length - 1)) : 0;

          return (
            <Float key={item.id} speed={1.5} floatIntensity={1.2} rotationIntensity={0.4}>
              <group position={[0, y, 0]}>
                <Html center transform={false} style={{ pointerEvents: 'none' }}>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary/external, admin-editable URLs; next/image requires a static remote allowlist */}
                    <img src={`https://cdn.simpleicons.org/${item.icon_key}`} alt={item.label} width={28} height={28} />
                    {project?.logo_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={project.logo_url} alt={project.title} width={20} height={20} className="rounded-full" />
                    )}
                  </div>
                </Html>
              </group>
            </Float>
          );
        })}
      </Canvas>
    </div>
  );
};

export default TechIconRail;

'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import type * as THREE from 'three';
import type { TechItem, Project } from '@/lib/content';

interface TechIconRailProps {
  items: TechItem[];
  projects: Project[];
}

// Tilts the whole rail toward the pointer, same interactive-parallax pattern
// used by HeroCamera for the old hero scene.
const PointerTilt = ({ children }: { children: React.ReactNode }) => {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.pointer.x * 0.2;
    group.current.rotation.x = -state.pointer.y * 0.15;
  });

  return <group ref={group}>{children}</group>;
};

const TechIcon = ({ item, project }: { item: TechItem; project?: Project }) => {
  const [hovered, setHovered] = useState(false);
  const content = (
    <div
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="pointer-events-auto flex items-center gap-2 whitespace-nowrap cursor-pointer transition-transform duration-200"
      style={{ transform: hovered ? 'scale(1.15)' : 'scale(1)' }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary/external, admin-editable URLs; next/image requires a static remote allowlist */}
      <img src={`https://cdn.simpleicons.org/${item.icon_key}`} alt={item.label} width={28} height={28} />
      {project?.logo_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={project.logo_url} alt={project.title} width={20} height={20} className="rounded-full" />
      )}
      {hovered && (
        <span className="font-mono text-xs bg-surface border border-line rounded px-2 py-1 text-primary">
          {project ? `${item.label} — ${project.title}` : item.label}
        </span>
      )}
    </div>
  );

  return project ? (
    <a href={project.href} target="_blank" rel="noreferrer">
      {content}
    </a>
  ) : (
    content
  );
};

const TechIconRail = ({ items, projects }: TechIconRailProps) => {
  if (items.length === 0) return null;

  return (
    <div className="hidden md:block fixed inset-y-0 right-0 w-48 pointer-events-none z-10" aria-hidden={false}>
      <Canvas camera={{ position: [0, 0, 10], fov: 40 }}>
        <ambientLight intensity={1} />
        <PointerTilt>
          {items.map((item, index) => {
            const project = item.project_slug ? projects.find((p) => p.slug === item.project_slug) : undefined;
            const spread = 8;
            const y = items.length > 1 ? spread / 2 - index * (spread / (items.length - 1)) : 0;

            return (
              <Float key={item.id} speed={1.5} floatIntensity={1.2} rotationIntensity={0.4}>
                <group position={[0, y, 0]}>
                  <Html center transform={false}>
                    <TechIcon item={item} project={project} />
                  </Html>
                </group>
              </Float>
            );
          })}
        </PointerTilt>
      </Canvas>
    </div>
  );
};

export default TechIconRail;

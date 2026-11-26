'use client';

import { useState } from 'react';

interface ProjectBulletProps {
  logoUrl: string | null;
  title: string;
}

// Project logo if it loads, falling back to a plain dash if there's no
// logo or the URL 404s (third-party favicons aren't always reliable).
const ProjectBullet = ({ logoUrl, title }: ProjectBulletProps) => {
  const [failed, setFailed] = useState(false);

  if (!logoUrl || failed) {
    return <span className="text-line">&mdash;</span>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- arbitrary/admin-editable URL, next/image requires a static remote allowlist
    <img src={logoUrl} alt={title} width={40} height={40} className="w-10 h-10 object-contain rounded-xl bg-chip border border-line shrink-0 md:w-5 md:h-5 md:rounded-sm md:bg-transparent md:border-0" onError={() => setFailed(true)} />
  );
};

export default ProjectBullet;

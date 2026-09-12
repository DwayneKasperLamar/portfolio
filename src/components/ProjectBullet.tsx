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
    <img src={logoUrl} alt={title} width={20} height={20} className="rounded-sm shrink-0" onError={() => setFailed(true)} />
  );
};

export default ProjectBullet;

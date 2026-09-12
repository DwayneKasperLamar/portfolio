'use client';

import { useState } from 'react';

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

// Renders nothing instead of a broken-image icon if the URL 404s --
// project/tech logos here are often third-party favicons we don't control.
const SafeImage = ({ src, alt, width, height, className }: SafeImageProps) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return null;

  // eslint-disable-next-line @next/next/no-img-element -- arbitrary/admin-editable URLs; next/image requires a static remote allowlist
  return <img src={src} alt={alt} width={width} height={height} className={className} onError={() => setFailed(true)} />;
};

export default SafeImage;

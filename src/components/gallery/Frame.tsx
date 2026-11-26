'use client';

/* eslint-disable @next/next/no-img-element -- media links are typed in the admin; next/image needs a fixed allowlist */
import { useEffect, useRef, useState } from 'react';
import type { Moment } from './media';

interface FrameProps {
  moment: Moment;
  playing?: boolean; // silently preview a video file
  bare?: boolean; // the caller already writes the title over the frame
}

// The picture of a moment: photo, video still, or a written card when there is no media yet.
const Frame = ({ moment, playing, bare }: FrameProps) => {
  const [broken, setBroken] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (playing && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) v.play().catch(() => {});
    else v.pause();
  }, [playing]);

  const still = moment.image ?? (moment.youtubeId ? `https://i.ytimg.com/vi/${moment.youtubeId}/hqdefault.jpg` : null);
  const isVideo = Boolean(moment.videoFile || moment.youtubeId);

  let picture: React.ReactNode;
  if (moment.videoFile) {
    picture = (
      <video ref={video} src={`${moment.videoFile}#t=0.1`} poster={moment.image ?? undefined} muted loop playsInline preload="metadata" className="w-full h-full object-cover" />
    );
  } else if (still && !broken) {
    picture = <img src={still} alt={moment.title} loading="lazy" draggable={false} onError={() => setBroken(true)} className="w-full h-full object-cover" />;
  } else {
    picture = (
      <span className="flex flex-col items-center justify-center gap-2 w-full h-full p-4 text-center bg-surface-alt overflow-hidden">
        {!bare && (
          <>
            <span className="font-sans text-xs text-muted">{moment.label}</span>
            <span className="text-primary leading-snug">{moment.title}</span>
          </>
        )}
      </span>
    );
  }

  return (
    <span className="relative block w-full h-full">
      {picture}
      {isVideo && <span className="absolute right-2 top-2 font-sans text-[0.65rem] bg-veil text-on-veil rounded-full px-2 py-0.5 pointer-events-none">&#9654; video</span>}
    </span>
  );
};

export default Frame;

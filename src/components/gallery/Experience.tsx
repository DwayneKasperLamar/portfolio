'use client';

import { useState } from 'react';
import DepthWalk from './DepthWalk';
import StackedMoments from './StackedMoments';
import Mosaic from './Mosaic';
import Waterfall from './Waterfall';
import Viewer from './Viewer';
import { useMedia } from './useMedia';
import type { Moment } from './media';

// Picks the web or phone layout and holds the full-screen viewer.
const Experience = ({ moments, kind, phoneLimit }: { moments: Moment[]; kind: 'story' | 'gallery'; phoneLimit?: number }) => {
  const phone = useMedia('(max-width: 767px)');
  const [open, setOpen] = useState<number | null>(null);

  if (phone === undefined) return <div className="h-[540px] rounded-xl bg-stage" aria-hidden />;

  return (
    <>
      {kind === 'gallery' ? (
        phone ? (
          <Waterfall moments={moments} limit={phoneLimit} onOpen={setOpen} />
        ) : (
          <Mosaic moments={moments} onOpen={setOpen} />
        )
      ) : phone ? (
        <StackedMoments moments={moments} onOpen={setOpen} />
      ) : (
        <DepthWalk moments={moments} onOpen={setOpen} />
      )}
      <Viewer moments={moments} index={open} onChange={setOpen} />
    </>
  );
};

export default Experience;

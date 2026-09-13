'use client';

import { Video } from '@/lib/types';
import VideoCard from './VideoCard';
import InContentCTA from './InContentCTA';

interface Props {
  videos: Video[];
  showCtaEvery?: number;
}

export default function VideoGrid({ videos, showCtaEvery = 6 }: Props) {
  const items: React.ReactNode[] = [];
  videos.forEach((v, i) => {
    items.push(<VideoCard key={`${v.source}-${v.id}`} video={v} priority={i < 4} />);
    if ((i + 1) % showCtaEvery === 0 && i < videos.length - 1) {
      items.push(<InContentCTA key={`cta-${i}`} />);
    }
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
      {items}
    </div>
  );
}

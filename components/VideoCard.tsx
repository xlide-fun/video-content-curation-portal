'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Video } from '@/lib/types';

interface Props {
  video: Video;
  priority?: boolean;
}

export default function VideoCard({ video, priority }: Props) {
  const href = `/video/${video.source}/${video.id}/`;
  const thumb = video.thumbnails.large || video.thumbnails.medium || video.thumbnails.small || '';
  const mins = Math.floor(video.duration / 60);
  const secs = video.duration % 60;

  return (
    <Link href={href} className="video-card block group">
      <div className="relative aspect-[9/16] md:aspect-video">
        {thumb ? (
          <Image
            src={thumb}
            alt={video.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
            priority={priority}
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gray-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="absolute bottom-2 right-2 text-xs bg-black/70 px-1.5 py-0.5 rounded">
          {mins}:{secs.toString().padStart(2, '0')}
        </span>
        <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wider bg-brand-pink/90 px-1.5 py-0.5 rounded">
          {video.source}
        </span>
      </div>
      <div className="p-2">
        <h3 className="text-sm font-medium line-clamp-2 group-hover:text-brand-pink transition-colors">
          {video.title}
        </h3>
        <p className="text-xs text-gray-400 mt-1">{video.views.toLocaleString()} views</p>
      </div>
    </Link>
  );
}

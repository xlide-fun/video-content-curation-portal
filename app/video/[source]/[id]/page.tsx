import { getVideo, searchVideos } from '@/lib/fetchers';
import { Source } from '@/lib/types';
import VideoGrid from '@/components/VideoGrid';
import InterstitialOverlay from '@/components/InterstitialOverlay';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import site from '@/config/site.json';

export const revalidate = 3600;

interface Props { params: { source: string; id: string } }

export async function generateMetadata({ params }: Props) {
  const source = params.source as Source;
  if (source !== 'redgifs' && source !== 'eporner') return {};
  const video = await getVideo(source, params.id);
  if (!video) return { title: 'Video not found' };
  return {
    title: video.title,
    description: `${video.title} — ${video.tags.slice(0, 5).join(', ')}. Watch now on ${site.siteName}.`,
    openGraph: {
      title: video.title,
      description: video.tags.join(', '),
      images: video.thumbnails.large ? [{ url: video.thumbnails.large }] : [],
      type: 'video.other'
    }
  };
}

export default async function VideoPage({ params }: Props) {
  const source = params.source as Source;
  if (source !== 'redgifs' && source !== 'eporner') notFound();
  const video = await getVideo(source, params.id);
  if (!video) notFound();

  let related: any[] = [];
  try {
    const tag = video.tags[0] || '';
    const res = await searchVideos(tag, 1, 10);
    related = res.videos.filter((v) => !(v.source === video.source && v.id === video.id)).slice(0, 8);
  } catch {}

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.tags.join(', '),
    thumbnailUrl: video.thumbnails.large || video.thumbnails.medium,
    uploadDate: video.created,
    duration: `PT${Math.floor(video.duration / 60)}M${video.duration % 60}S`,
    contentUrl: video.videoUrl,
    embedUrl: video.embedUrl
  };

  return (
    <div>
      <Script id="video-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <InterstitialOverlay />
      <div className="mb-6">
        <div className="immersive-player mb-4">
          {video.embedUrl ? (
            <iframe src={video.embedUrl} className="w-full h-full min-h-[50vh]" allowFullScreen allow="autoplay; fullscreen" loading="lazy" />
          ) : video.videoUrl ? (
            <video src={video.videoUrl} controls autoPlay playsInline className="w-full h-full" poster={video.thumbnails.large} />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">No playback source</div>
          )}
        </div>
        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
        <p className="text-gray-400 text-sm mb-3">{video.views.toLocaleString()} views · {video.source}</p>
        <div className="flex flex-wrap gap-2">
          {video.tags.map((t) => (
            <a key={t} href={`/tag/${encodeURIComponent(t)}/`} className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-brand-pink/70">{t}</a>
          ))}
        </div>
      </div>
      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Related</h2>
          <VideoGrid videos={related} showCtaEvery={4} />
        </section>
      )}
    </div>
  );
}

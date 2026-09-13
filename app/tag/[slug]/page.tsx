import { searchVideos } from '@/lib/fetchers';
import VideoGrid from '@/components/VideoGrid';
import site from '@/config/site.json';
import Link from 'next/link';

export const revalidate = 600;

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props) {
  const tag = decodeURIComponent(params.slug);
  const year = new Date().getFullYear();
  return {
    title: `Best ${tag} videos ${year}`,
    description: `Latest ${tag} compilation, top ${tag}, today ${tag}. Curated immersive clips.`
  };
}

export default async function TagPage({ params }: Props) {
  const tag = decodeURIComponent(params.slug).toLowerCase();
  let videos = [];
  try {
    const result = await searchVideos(tag, 1, 48);
    videos = result.videos;
  } catch {}
  const year = new Date().getFullYear();
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 capitalize">Best {tag} videos {year}</h1>
      <p className="text-gray-400 mb-6">Latest {tag} · Top {tag} · Today {tag} · {tag} compilation</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {site.playlists.slice(0, 5).map((p) => (
          <Link key={p} href={`/playlist/${p}/`} className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-brand-pink/70">{p.replace(/-/g, ' ')}</Link>
        ))}
      </div>
      {videos.length > 0 ? <VideoGrid videos={videos} /> : <p className="text-gray-500">No results for this tag yet.</p>}
    </div>
  );
}

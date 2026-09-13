import { searchVideos } from '@/lib/fetchers';
import VideoGrid from '@/components/VideoGrid';
import fs from 'fs';
import path from 'path';
import { Playlist } from '@/lib/types';

export const revalidate = 1800;

interface Props { params: { slug: string } }

function loadPlaylist(slug: string): Playlist | null {
  try {
    const file = path.join(process.cwd(), 'data', 'playlists', `${slug}.json`);
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch { return null; }
}

export async function generateMetadata({ params }: Props) {
  const pl = loadPlaylist(params.slug);
  const title = pl?.title || params.slug.replace(/-/g, ' ');
  return { title, description: pl?.description || `Curated playlist: ${title}` };
}

export default async function PlaylistPage({ params }: Props) {
  const pl = loadPlaylist(params.slug);
  const title = pl?.title || params.slug.replace(/-/g, ' ');
  const description = pl?.description || 'Staff curated collection';
  let videos = [];
  try {
    const seed = pl?.tags?.[0] || params.slug.replace(/-/g, ' ');
    const result = await searchVideos(seed, 1, 40);
    videos = result.videos;
  } catch {}
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 capitalize">{title}</h1>
      <p className="text-gray-400 mb-6">{description}</p>
      {videos.length > 0 ? <VideoGrid videos={videos} /> : <p className="text-gray-500">Playlist refreshing…</p>}
    </div>
  );
}

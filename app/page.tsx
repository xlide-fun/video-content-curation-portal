import { getTrending } from '@/lib/fetchers';
import VideoGrid from '@/components/VideoGrid';
import Link from 'next/link';
import site from '@/config/site.json';

export const revalidate = 600;

export default async function HomePage() {
  let videos = [];
  try {
    const result = await getTrending(40);
    videos = result.videos;
  } catch {
    videos = [];
  }

  return (
    <div>
      <section className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{site.tagline}</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">{site.description}</p>
      </section>
      <section className="mb-6 flex flex-wrap gap-2 justify-center">
        {site.playlists.slice(0, 8).map((slug) => (
          <Link key={slug} href={`/playlist/${slug}/`} className="px-3 py-1.5 rounded-full bg-white/10 text-sm hover:bg-brand-pink/80 transition">
            {slug.replace(/-/g, ' ')}
          </Link>
        ))}
      </section>
      <h2 className="text-xl font-semibold mb-4">Trending Now</h2>
      {videos.length > 0 ? <VideoGrid videos={videos} /> : <p className="text-gray-500">Configure APIs and redeploy.</p>}
    </div>
  );
}

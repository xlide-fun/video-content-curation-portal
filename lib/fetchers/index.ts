import { Source, Video, SearchResult } from '../types';
import * as redgifs from './redgifs';
import * as eporner from './eporner';

export async function searchVideos(
  query: string,
  page = 1,
  count = 30,
  source?: Source
): Promise<SearchResult> {
  if (source === 'redgifs') return redgifs.searchRedgifs(query, page, count);
  if (source === 'eporner') return eporner.searchEporner(query, page, count);

  const [a, b] = await Promise.allSettled([
    redgifs.searchRedgifs(query, page, Math.ceil(count / 2)),
    eporner.searchEporner(query, page, Math.ceil(count / 2))
  ]);
  const interleaved: Video[] = [];
  const max = Math.max(
    a.status === 'fulfilled' ? a.value.videos.length : 0,
    b.status === 'fulfilled' ? b.value.videos.length : 0
  );
  for (let i = 0; i < max; i++) {
    if (a.status === 'fulfilled' && a.value.videos[i]) interleaved.push(a.value.videos[i]);
    if (b.status === 'fulfilled' && b.value.videos[i]) interleaved.push(b.value.videos[i]);
  }
  return {
    videos: interleaved.slice(0, count),
    page,
    hasMore: interleaved.length >= count
  };
}

export async function getVideo(source: Source, id: string): Promise<Video | null> {
  if (source === 'redgifs') return redgifs.getRedgifsById(id);
  return eporner.getEpornerById(id);
}

export async function getTrending(count = 40): Promise<SearchResult> {
  return searchVideos('', 1, count);
}

export { redgifs, eporner };

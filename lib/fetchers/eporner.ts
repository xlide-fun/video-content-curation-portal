import { Video, SearchResult } from '../types';
import { cacheGet, cacheSet } from '../cache/redis';

const BASE = 'https://www.eporner.com/api/v2';

function mapVideo(v: any): Video {
  const sources = v.sources || [];
  const hd = sources.find((s: any) => s.quality === '1080p' || s.quality === '720p') || sources[0];
  const tags = (v.keywords || v.tags || '').toString().split(/[,\s]+/).filter(Boolean).map((t: string) => t.toLowerCase());
  return {
    id: v.id,
    source: 'eporner',
    title: v.title || tags.slice(0, 4).join(' ') || 'Untitled',
    tags,
    thumbnails: {
      small: v.default_thumb?.src || v.thumb,
      medium: v.default_thumb?.src || v.thumb,
      large: v.default_thumb?.src || v.thumb
    },
    videoUrl: hd?.src || v.url || '',
    duration: typeof v.length_sec === 'number' ? v.length_sec : parseDuration(v.length),
    views: Number(v.views) || 0,
    created: v.added || v.upload_date || new Date().toISOString(),
    embedUrl: `https://www.eporner.com/embed/${v.id}/`
  };
}

function parseDuration(str: string): number {
  if (!str) return 0;
  const parts = str.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return Number(str) || 0;
}

export async function searchEporner(
  query: string,
  page = 1,
  perPage = 30,
  order: 'latest' | 'most-popular' | 'top-rated' | 'top-weekly' | 'longest' = 'most-popular'
): Promise<SearchResult> {
  const cacheKey = `ep:search:${query}:${page}:${perPage}:${order}`;
  const cached = await cacheGet<SearchResult>(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams({
    query: query || 'all',
    per_page: String(perPage),
    page: String(page),
    thumbsize: 'big',
    order,
    format: 'json',
    gay: '0',
    lq: '0'
  });

  const res = await fetch(`${BASE}/video/search/?${params}`, {
    next: { revalidate: 600 }
  });
  if (!res.ok) throw new Error(`Eporner search ${res.status}`);
  const data = await res.json();
  const videos = (data.videos || []).map(mapVideo);
  const result: SearchResult = {
    videos,
    page,
    total: data.total_count,
    hasMore: videos.length >= perPage
  };
  await cacheSet(cacheKey, result, 3600);
  return result;
}

export async function getEpornerById(id: string): Promise<Video | null> {
  const cacheKey = `ep:id:${id}`;
  const cached = await cacheGet<Video>(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams({ id, thumbsize: 'big', format: 'json' });
  const res = await fetch(`${BASE}/video/id/?${params}`, {
    next: { revalidate: 3600 }
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data || data.removed) return null;
  const video = mapVideo(data);
  await cacheSet(cacheKey, video, 7200);
  return video;
}

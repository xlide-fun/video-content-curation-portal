import { Video, SearchResult } from '../types';
import { cacheGet, cacheSet, isKeyDegraded, markKeyDegraded } from '../cache/redis';

const BASE = 'https://api.redgifs.com';

let tempToken: string | null = null;
let tokenExpiry = 0;

async function getTempToken(): Promise<string> {
  if (tempToken && Date.now() < tokenExpiry) return tempToken;
  const res = await fetch(`${BASE}/v2/auth/temporary`, {
    headers: {
      Origin: 'https://www.redgifs.com',
      Referer: 'https://www.redgifs.com/'
    },
    next: { revalidate: 3000 }
  });
  if (!res.ok) throw new Error('Redgifs temp token failed');
  const data = await res.json();
  tempToken = data.token;
  tokenExpiry = Date.now() + 50 * 60 * 1000;
  return tempToken!;
}

function mapGif(gif: any): Video {
  const urls = gif.urls || {};
  const videoUrl = urls.hd || urls.sd || urls.mobile || '';
  const tags = (gif.tags || []).map((t: string) => t.toLowerCase());
  return {
    id: gif.id,
    source: 'redgifs',
    title: gif.title || tags.slice(0, 3).join(' ') || 'Untitled',
    tags,
    thumbnails: {
      small: urls.thumbnail || urls.poster,
      medium: urls.poster || urls.thumbnail,
      large: urls.poster
    },
    videoUrl,
    duration: gif.duration || 0,
    views: gif.views || 0,
    created: gif.createDate ? new Date(gif.createDate * 1000).toISOString() : new Date().toISOString(),
    embedUrl: `https://www.redgifs.com/ifr/${gif.id}`
  };
}

export async function searchRedgifs(
  query: string,
  page = 1,
  count = 30,
  order: 'trending' | 'top' | 'latest' | 'relevance' = 'trending'
): Promise<SearchResult> {
  const cacheKey = `rg:search:${query}:${page}:${count}:${order}`;
  const cached = await cacheGet<SearchResult>(cacheKey);
  if (cached) return cached;

  const token = await getTempToken();
  const params = new URLSearchParams({
    search_text: query,
    count: String(count),
    page: String(page),
    order
  });
  const res = await fetch(`${BASE}/v2/gifs/search?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Origin: 'https://www.redgifs.com',
      Referer: 'https://www.redgifs.com/'
    },
    next: { revalidate: 600 }
  });

  if (res.status === 429 || res.status === 401) {
    await markKeyDegraded('redgifs-temp');
    throw new Error('Redgifs rate limited');
  }
  if (!res.ok) throw new Error(`Redgifs search ${res.status}`);

  const data = await res.json();
  const videos = (data.gifs || []).map(mapGif);
  const result: SearchResult = {
    videos,
    page,
    hasMore: videos.length >= count
  };
  await cacheSet(cacheKey, result, 3600);
  return result;
}

export async function getRedgifsById(id: string): Promise<Video | null> {
  const cacheKey = `rg:gif:${id}`;
  const cached = await cacheGet<Video>(cacheKey);
  if (cached) return cached;

  const token = await getTempToken();
  const res = await fetch(`${BASE}/v2/gifs/${id}?views=yes`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Origin: 'https://www.redgifs.com',
      Referer: 'https://www.redgifs.com/'
    },
    next: { revalidate: 3600 }
  });
  if (!res.ok) return null;
  const data = await res.json();
  const video = mapGif(data.gif || data);
  await cacheSet(cacheKey, video, 7200);
  return video;
}

export async function getRedgifsTrending(count = 30, page = 1): Promise<SearchResult> {
  return searchRedgifs('', page, count, 'trending');
}

export async function getRedgifsTags(): Promise<string[]> {
  const cacheKey = 'rg:tags';
  const cached = await cacheGet<string[]>(cacheKey);
  if (cached) return cached;
  const token = await getTempToken();
  const res = await fetch(`${BASE}/v1/tags`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 86400 }
  });
  if (!res.ok) return [];
  const data = await res.json();
  const tags = (data.tags || data || []).map((t: any) => (typeof t === 'string' ? t : t.name)).filter(Boolean);
  await cacheSet(cacheKey, tags, 86400);
  return tags;
}

export type Source = 'redgifs' | 'eporner';

export interface Video {
  id: string;
  source: Source;
  title: string;
  tags: string[];
  thumbnails: {
    small?: string;
    medium?: string;
    large?: string;
  };
  videoUrl: string;
  duration: number;
  views: number;
  created: string;
  embedUrl?: string;
}

export interface SearchResult {
  videos: Video[];
  page: number;
  total?: number;
  hasMore: boolean;
}

export interface Playlist {
  slug: string;
  title: string;
  description: string;
  videoIds: Array<{ source: Source; id: string }>;
  tags: string[];
}

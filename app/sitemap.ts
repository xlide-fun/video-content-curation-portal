import { MetadataRoute } from 'next';
import site from '@/config/site.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  const entries: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: `${base}/dmca/`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 }
  ];

  for (const slug of site.playlists) {
    entries.push({
      url: `${base}/playlist/${slug}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8
    });
  }

  const tags = ['trending', 'viral', 'compilation', 'immersive', 'fresh', 'top', 'today'];
  for (const t of tags) {
    entries.push({
      url: `${base}/tag/${t}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7
    });
  }

  return entries;
}

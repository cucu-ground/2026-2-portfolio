import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${siteUrl}/`, lastModified: now, priority: 1 },
    { url: `${siteUrl}/activity`, lastModified: now, priority: 0.7 },
    { url: `${siteUrl}/guestbook`, lastModified: now, priority: 0.5 },
  ];
}

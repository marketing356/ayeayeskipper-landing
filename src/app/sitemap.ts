import type { MetadataRoute } from 'next'

const BASE = 'https://ayeayeskipper.com'
const PAGES = ['', '/features', '/hot-slip', '/transient', '/skipper-gangway', '/vs-dockwa', '/how-skipper-works', '/about', '/demo', '/support', '/privacy', '/terms']

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(p => ({ url: BASE + p, lastModified: new Date('2026-11-10'), changeFrequency: p === '' ? 'weekly' : 'monthly', priority: p === '' ? 1 : 0.7 }))
}

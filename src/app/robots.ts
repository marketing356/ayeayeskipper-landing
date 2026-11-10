import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/account', '/boaters', '/login', '/marina-login', '/welcome', '/payment-success'] }],
    sitemap: 'https://ayeayeskipper.com/sitemap.xml',
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['64.225.58.189', 'http://64.225.58.189:3002'],
  serverExternalPackages: ['nodemailer', '@react-three/fiber', '@react-three/drei', 'three'],
  // Prevent Three.js from loading on pages that don't use the configurator
  bundlePagesRouterDependencies: false,
  experimental: {
    // Allow up to 25MB request bodies — needed for dock configurator + contact form file uploads
    serverActions: { bodySizeLimit: '25mb' },
    // Optimize package imports — reduces bundle size for icon/component libraries
    optimizePackageImports: ['lucide-react', 'react-icons', 'framer-motion'],
  },
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/images/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'fal.media' },
      { protocol: 'https', hostname: '*.fal.media' },
    ],
  },
  async redirects() {
    return [
      // www → non-www canonical redirect
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.expressdocks.com' }],
        destination: 'https://expressdocks.com/:path*',
        permanent: true,
      },
      // New redirects — April 2025
      { source: '/residential-docks', destination: '/residential', permanent: true },
      { source: '/modulardocks', destination: '/blog/what-to-know-before-buying-a-modular-dock-system-c', permanent: true },
      { source: '/modulardocks/', destination: '/blog/what-to-know-before-buying-a-modular-dock-system-c', permanent: true },
      // Legacy Squarespace URL redirects — preserve SEO equity
      { source: '/floating-dock', destination: '/residential', permanent: true },
      { source: '/fixed-dock', destination: '/residential', permanent: true },
      { source: '/modular-docks', destination: '/residential', permanent: true },
      { source: '/non-modular-docks', destination: '/commercial-docks', permanent: true },
      { source: '/cement-docks', destination: '/commercial-docks', permanent: true },
      // /pilebuddy has its own page — no redirect needed
      // Common Squarespace URL patterns
      { source: '/dock-systems', destination: '/residential', permanent: true },
      { source: '/aluminum-docks', destination: '/residential', permanent: true },
      { source: '/floating-docks', destination: '/residential', permanent: true },
      { source: '/fixed-docks', destination: '/commercial-docks', permanent: true },
      { source: '/dock-accessories', destination: '/accessories', permanent: true },
      { source: '/dock-houses', destination: '/dockhouses', permanent: true },
      { source: '/dock-house', destination: '/dockhouses', permanent: true },
      { source: '/boathouses', destination: '/dockhouses', permanent: true },
      { source: '/get-a-quote', destination: '/contact', permanent: true },
      { source: '/quote', destination: '/contact', permanent: true },
      { source: '/request-a-quote', destination: '/contact', permanent: true },
      // Blog duplicate content merges — April 2026
      // Cost guide: consolidate 4 versions → keeper has GA4 referral traffic
      { source: '/blog/aluminum-floating-dock-cost-guide-2026-complete-pr', destination: '/blog/how-much-does-an-aluminum-floating-dock-cost-in-20', permanent: true },
      { source: '/blog/aluminum-floating-dock-cost-guide-2026-pricing-fac', destination: '/blog/how-much-does-an-aluminum-floating-dock-cost-in-20', permanent: true },
      { source: '/blog/aluminum-floating-dock-cost-guide-2026-what-youll', destination: '/blog/how-much-does-an-aluminum-floating-dock-cost-in-20', permanent: true },
      // Floating vs Fixed dock: consolidate 2 versions → cleaner URL wins
      { source: '/blog/how-to-choose-between-a-floating-dock-and-a-fixed', destination: '/blog/floating-dock-vs-fixed-dock-which-type-is-right-for-your-wat', permanent: true },
    // Blog duplicate cleanup redirects (2025-04-20)
    {
      source: '/blog/aluminum-floating-dock-cost-guide-2026-pricing-fac',
      destination: '/blog/aluminum-floating-dock-cost-2026',
      permanent: true
    },
    {
      source: '/blog/aluminum-floating-dock-cost-guide-2026-what-youll',
      destination: '/blog/aluminum-floating-dock-cost-2026',
      permanent: true
    },
    {
      source: '/blog/how-much-does-an-aluminum-floating-dock-cost-in-20',
      destination: '/blog/aluminum-floating-dock-cost-2026',
      permanent: true
    },
    {
      source: '/blog/how-to-choose-between-a-floating-dock-and-a-fixed',
      destination: '/blog/floating-vs-fixed-dock-comparison',
      permanent: true
    },
    {
      source: '/blog/floating-dock-weight-capacity-everything-you-need',
      destination: '/blog/floating-dock-weight-capacity-guide',
      permanent: true
    },
    {
      source: '/blog/tommy-docks-vs-expressdocks-why-plastic-floating-d',
      destination: '/blog/expressdocks-vs-tommy-docks-comparison',
      permanent: true
    },
    {
      source: '/blog/why-aluminum-floating-docks-outlast-wood-and-steel',
      destination: '/blog/why-aluminum-floating-docks-best-choice',
      permanent: true
    },

    ];
  },
};

module.exports = nextConfig;

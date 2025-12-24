import type { NextConfig } from 'next';
import { fileURLToPath } from 'url';

const nextConfig: NextConfig = {
    /* config options here */
    ...(process.env.CICD_PHASE === undefined 
        ? {
            cacheHandler: fileURLToPath(new URL('./cache-handler.mjs', import.meta.url)),
            cacheMaxMemorySize: 0,
        }
        : {}
    ),
    cacheComponents: true,
    cacheLife: {
        // Profiles personnalisés réutilisables
        'short': {
            stale: 60,           // 1 minute
            revalidate: 300,     // 5 minutes
            expire: 600,         // 10 minutes
        },
        'api-data': {
            stale: 300,          // 5 minutes
            revalidate: 600,     // 10 minutes
            expire: 3600,        // 1 heure
        },
        'user-data': {
            stale: 1800,         // 30 minutes
            revalidate: 3600,    // 1 heure
            expire: 86400,       // 1 jour
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'randomuser.me',
                port: '',
                pathname: '/api/portraits/**',
            },
            {
                protocol: 'https',
                hostname: 'images.ctfassets.net',
                port: '',
                pathname: `/${process.env.CONTENTFUL_SPACE_ID}/**`,
            }
        ],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 86400,
        deviceSizes: [96, 128, 256, 384],
        imageSizes: [96],
    },
    typedRoutes: true,
    logging: {
        fetches: {
            fullUrl: true,
            hmrRefreshes: true,
        },
        incomingRequests: true
    },
    experimental: {
        webVitalsAttribution: ['FCP', 'LCP', 'CLS', 'FID', 'TTFB', 'INP'],
        typedEnv: true,
    },
};

export default nextConfig;

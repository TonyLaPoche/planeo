/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration Next.js de base
  images: {
    unoptimized: true,
  },
  // Headers pour PWA
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/icon-192x192.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/icon-512x512.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

// Configuration PWA conditionnelle
if (process.env.NODE_ENV === 'production') {
  const withPWA = require('next-pwa')({
    dest: 'public',
    register: false, // Désactiver l'enregistrement automatique
    skipWaiting: true,
    buildExcludes: [
      /manifest\.json$/,
      /app-build-manifest\.json$/,
      /_buildManifest\.js$/,
      /_ssgManifest\.js$/,
      /.*\.map$/
    ],
    additionalManifestEntries: [],
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'offlineCache',
          expiration: {
            maxEntries: 200,
          },
        },
      },
    ],
  })

  module.exports = withPWA(nextConfig)
} else {
  // En développement, pas de PWA
  module.exports = nextConfig
}

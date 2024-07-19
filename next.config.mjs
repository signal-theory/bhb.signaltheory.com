/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      formats: ['image/avif', 'image/webp'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'bhb-signaltheory.mysites.io',
        },
      ],
    }};

export default nextConfig;

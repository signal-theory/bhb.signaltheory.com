/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      formats: ['image/avif', 'image/webp'],
      domains: ['bhb-signaltheory.mysites.io'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'gosarpinos.flywheelsites.com',
        },
      ],
    }};

export default nextConfig;

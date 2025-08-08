import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.stockx.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'labubumarket.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'labubuworld.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'labubukeychain.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'di2ponv0v5otw.cloudfront.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ebayimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'labubu-doll.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'toysez.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.annurah.de',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pushas.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
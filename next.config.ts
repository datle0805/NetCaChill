import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'phim.nguonc.com',
      },
      {
        protocol: 'https',
        hostname: 'img.ophim.live',
      },
      {
        protocol: 'https',
        hostname: 'phimimg.com',
      },
      {
        protocol: 'https',
        hostname: 'img.phimapi.com',
      }
    ],
  },
};

export default nextConfig;

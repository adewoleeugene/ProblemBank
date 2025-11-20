import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 85, 90, 95, 100],
    minimumCacheTTL: 60 * 60 * 24 * 365, // Cache images for 1 year
  },
  // Performance optimizations
  compress: true,
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Optimize production builds
  poweredByHeader: false, // Remove X-Powered-By header
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
};

export default nextConfig;

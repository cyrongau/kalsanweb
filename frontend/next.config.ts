import type { NextConfig } from "next";

const nextConfig = {
  /* config options here */
  // Removed rewrites to force usage of app/web-api/[...path]/route.ts
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

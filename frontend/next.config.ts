import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    const backendUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    console.log(`[Next.js] Rewriting /api to ${backendUrl}`);
    console.log(`[Next.js] ENV: INTERNAL_API_URL=${process.env.INTERNAL_API_URL}, NEXT_PUBLIC_API_URL=${process.env.NEXT_PUBLIC_API_URL}`);
    return [
      {
        source: '/web-api/:path*',
        destination: `${backendUrl}/:path*`, // Rewrite /web-api request to backend root
      },
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;

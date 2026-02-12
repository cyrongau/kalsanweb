import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    // Hardcode for debugging
    const backendUrl = 'http://backend:3001';
    console.log(`[Next.js] HARDCODED URL: ${backendUrl}`);
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

import redirects from "./redirects.js";

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      ...[
        NEXT_PUBLIC_SERVER_URL,
        "https://res.cloudinary.com" /* 'https://example.com' */,
      ].map((item) => {
        const url = new URL(item);

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(":", ""),
        };
      }),
    ],
  },
  reactStrictMode: true,
  redirects,
};

export default nextConfig;

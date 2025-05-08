import redirects from "./redirects.js";

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

const DEBUG_LEVEL = process.env.DEBUG_LEVEL || "error,warn,info,log";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
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
  compiler: {
    // Remove all console logs, excluding error logs
    removeConsole: {
      exclude: ["error", "warn", "info", "debug", "log", "trace"].filter((e) =>
        DEBUG_LEVEL.includes(e)
      ),
    },
  },
};

export default nextConfig;

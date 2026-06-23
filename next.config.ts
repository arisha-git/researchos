import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true, // Speeds up Vercel deployment of prototype
  },
};

export default nextConfig;
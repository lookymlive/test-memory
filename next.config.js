/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true, // Required for Cloudflare Pages deployment
  },
  // Cloudflare Pages compatibility
  output: "standalone",
  // Remove experimental settings that might cause issues
};

module.exports = nextConfig;

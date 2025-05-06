/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true, // Required for Cloudflare Pages deployment
    domains: ["localhost"], // Add any other domains you use for images
  },
  // Ensure compatibility with Cloudflare Pages
  experimental: {
    // Necessary for Cloudflare Pages edge functions
    appDir: true,
  },
  // Add any other configuration options here
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: false,
  },
  output: "standalone",
  // Remove experimental settings that might cause issues
};

module.exports = nextConfig;

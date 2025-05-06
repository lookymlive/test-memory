// Cloudflare Pages Build Configuration
export default {
  buildCommand: "npm run build",
  buildOutputDirectory: ".next",
  framework: "nextjs",
  nodeCompatibilityDate: "2023-07-10",
  nodeVersion: "18",
  routes: [
    {
      pattern: "/_next/static/*",
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
      },
    },
    {
      pattern: "/_next/data/*",
      headers: {
        "cache-control": "public, max-age=3600",
      },
    },
  ],
  assets: {
    browser: {
      baseUrl: "/_next",
      includeFiles: ["static/**/*"],
    },
  },
};

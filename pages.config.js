// Cloudflare Pages Configuration
export default {
  // Output directory to deploy
  outDir: ".next",

  // Build settings
  build: {
    command: "npm run build",
    environment: {
      NODE_VERSION: "18",
    },
  },

  // Routing
  routes: [
    // Static assets
    {
      pattern: "/_next/static/*",
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
      },
    },
    // API routes
    {
      pattern: "/api/*",
      function: "api",
    },
    // Default catch all
    {
      pattern: "*",
      function: "render",
    },
  ],

  // Functions configuration
  functions: {
    // Environment variables for functions
    environment: {
      NODE_ENV: "production",
    },
  },
};

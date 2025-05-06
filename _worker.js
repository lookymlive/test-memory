// _worker.js - Cloudflare Worker for Next.js

export default {
  async fetch(request, env) {
    // Forward the request to the Next.js app
    const url = new URL(request.url);

    // Handle static assets from Next.js build
    if (url.pathname.startsWith("/_next/static/")) {
      // Add cache headers for static assets
      const response = await fetch(request);
      const headers = new Headers(response.headers);
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
      return new Response(response.body, {
        status: response.status,
        headers,
      });
    }

    // Handle all other routes
    return fetch(request);
  },
};

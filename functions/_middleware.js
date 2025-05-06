// This middleware helps route Next.js requests properly on Cloudflare Pages
export async function onRequest(context) {
  // Just pass through the request to the Next.js app
  return await context.next();
}

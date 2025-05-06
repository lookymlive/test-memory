# Cloudflare Pages Deployment Checklist

## Pre-Deployment Tasks

- [ ] Run a full build locally to ensure no errors
  ```bash
  npm run build
  ```
- [ ] Ensure all environment variables are documented
- [ ] Commit and push all changes to GitHub repository
- [ ] Make sure `.gitignore` excludes sensitive files and build artifacts
- [ ] Check that Supabase access is configured correctly

## Cloudflare Account Setup

- [ ] Create or access Cloudflare account
- [ ] Add domain to Cloudflare (if using a custom domain)
- [ ] Set up DNS records if using a custom domain

## Cloudflare Pages Configuration

- [ ] Go to Cloudflare Dashboard → Pages
- [ ] Click "Create a project" → "Connect to Git"
- [ ] Select GitHub account and authorize Cloudflare
- [ ] Choose the test-memory repository
- [ ] Configure build settings:
  - [ ] Framework preset: Next.js
  - [ ] Build command: `npm run build`
  - [ ] Build output directory: `.next`
  - [ ] Node.js version: 18.x or later
  - [ ] Include build command in production build: Yes

## Environment Variables

- [ ] Add the following environment variables:

| Variable | Production Value | Development Value |
|----------|------------------|-------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | *your-prod-value* | *your-dev-value* |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *your-prod-value* | *your-dev-value* |
| *Add any other required variables* | | |

## Post-Deployment Verification

- [ ] Check the deployment log for any errors
- [ ] Test the deployed application:
  - [ ] Test public pages (home, about, disciplines)
  - [ ] Test authentication (login, register)
  - [ ] Test protected routes (profile, training)
  - [ ] Verify database connections
  - [ ] Test all training disciplines
  - [ ] Verify mobile responsiveness

## Custom Domain Setup (If Applicable)

- [ ] Go to Cloudflare Pages → Your project → Custom domains
- [ ] Add your custom domain
- [ ] Set up the necessary DNS records (CNAME or ALIAS)
- [ ] Verify SSL certificate is properly configured

## Performance Optimization

- [ ] Enable Cloudflare caching (Cache everything)
- [ ] Configure Cloudflare's Auto Minify for HTML, CSS, and JS
- [ ] Enable Brotli compression if available
- [ ] Configure Cloudflare's image optimization

## Security Settings

- [ ] Set up appropriate security headers
- [ ] Configure Firewall rules if needed
- [ ] Set up rate limiting for sensitive endpoints
- [ ] Enable Bot Management for protection

## Monitoring Setup

- [ ] Set up Cloudflare Analytics
- [ ] Configure error alerts (if available)
- [ ] Set up performance monitoring

## Rollback Plan

- [ ] Document how to roll back to a previous version if issues occur
- [ ] Test the rollback process to ensure it works

## Final Checks

- [ ] Verify all features work correctly in production
- [ ] Check console for any JavaScript errors
- [ ] Verify all API endpoints are responding correctly
- [ ] Test on multiple browsers and devices

---

**Important Notes:**
- Keep your API keys and environment variables secure
- Monitor Cloudflare and Supabase usage to stay within free tier limits
- Set up deployment notifications to stay informed of deployment status

Last updated: May 6, 2025 
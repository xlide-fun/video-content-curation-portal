# Video Content Curation Portal

Static-first Next.js 14 portal aggregating Redgifs + Eporner. Host: Cloudflare Pages.

## Deploy

Build: `npm run build` → output `out`
Connect repo in Cloudflare Pages. Secrets: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, SITE_URL, UPSTASH_*.

```bash
npm i && npm run build
npx wrangler pages deploy out --project-name=video-content-curation-portal
```

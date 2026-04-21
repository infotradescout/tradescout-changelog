# Deploying TradeScout Changelog 24/7

This project is now configured for Vercel static deployment via `vercel.json`.

## 1) Deploy from GitHub

1. Go to Vercel and click **Add New Project**.
2. Import `infotradescout/tradescout-changelog`.
3. Keep default branch as `main`.
4. Deploy.

Vercel will use:
- Install: `corepack pnpm install --frozen-lockfile`
- Build: `corepack pnpm exec vite build`
- Output: `dist/public`

## 2) Add Your Custom Domain

Use your desired production domain, for example:
- `tradescoutinfo.us`
- `www.tradescoutinfo.us`

In Vercel Project Settings -> Domains:
1. Add `tradescoutinfo.us`
2. Add `www.tradescoutinfo.us`
3. Set your preferred primary domain (usually `www`), and redirect the other to it.

## 3) DNS Records

At your DNS provider:

- For apex/root (`tradescoutinfo.us`): add an **A** record  
  - Host: `@`  
  - Value: `76.76.21.21`

- For `www`: add a **CNAME** record  
  - Host: `www`  
  - Value: `cname.vercel-dns.com`

## 4) Environment Variables (Optional but Recommended)

Set these in Vercel -> Project Settings -> Environment Variables to remove analytics build warnings:
- `VITE_ANALYTICS_ENDPOINT`
- `VITE_ANALYTICS_WEBSITE_ID`

Example:
- `VITE_ANALYTICS_ENDPOINT=https://analytics.yourdomain.com`
- `VITE_ANALYTICS_WEBSITE_ID=<your-umami-site-id>`

## 5) Verify

After DNS propagates:
1. Open your production domain.
2. Hard refresh once (Ctrl/Cmd+Shift+R).
3. Confirm the latest commit content is visible.
4. Confirm HTTPS certificate is issued (lock icon in browser).

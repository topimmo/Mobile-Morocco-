# Mobile Morocco - Deployment Guide

## Pre-Deployment Checklist

Before deploying to production, run:

```bash
npm run deploy:check
```

This command:
1. Type-checks all TypeScript code (`npm run typecheck`)
2. Builds the production bundle (`npm run build`)
3. Runs smoke tests against preview server (`npm run test:e2e`)

**⚠️ Only deploy if all checks pass!**

## Environment Variables

### Required Variables (MUST be set)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xyz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJ...` |

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_APP_ENV` | `production` | App environment |
| `VITE_BASE_URL` | `/` | Base URL path |

### Server-Side Only (Never expose to frontend)

| Variable | Description |
|----------|-------------|
| `SUPABASE_PROJECT_ID` | For type generation |
| `SUPABASE_SERVICE_KEY` | For admin operations |

## SPA Routing Configuration

This is a Single Page Application (SPA). All routes must fallback to `index.html`.

### Hostinger / Apache / cPanel

The `public/.htaccess` file handles this automatically:

```apache
RewriteEngine On
RewriteBase /
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

### Vercel

The `vercel.json` file handles this:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Netlify

The `public/_redirects` file handles this:

```
/*    /index.html   200
```

### Test Routing

After deployment, test these URLs by visiting them directly:
- `https://your-domain.com/phones`
- `https://your-domain.com/stores`
- `https://your-domain.com/auth/login`

If you see a 404 error, your SPA routing is not configured correctly.

## Build Output

The build creates files in the `dist/` directory:

```
dist/
├── index.html          # Main entry point
├── assets/
│   ├── index-xxx.js    # Main app bundle
│   ├── vendor-xxx.js   # React/Router chunk
│   └── supabase-xxx.js # Supabase chunk
└── ...
```

## Error Handling

### Missing Environment Variables

If `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are missing:
1. The app shows a "Configuration Error" page
2. Console logs clear instructions
3. The app does NOT crash with a blank screen

### Network/API Errors

The app includes:
- Error boundaries for graceful degradation
- Network status monitoring
- Fallback content when API is unavailable

## Demo Content

The database includes demo listings marked with `[DEMO]` prefix:
- 5 demo stores
- 5 demo phones (new and used)
- 4 demo spare parts
- 4 demo equipment items
- 5 demo repair services

To remove demo content after launch:

```sql
DELETE FROM repair_services WHERE is_demo = TRUE;
DELETE FROM items WHERE is_demo = TRUE;
DELETE FROM stores WHERE is_demo = TRUE;
```

## Monitoring

After deployment, verify:
1. ✅ Homepage loads with content
2. ✅ Navigation works (click through pages)
3. ✅ Direct URL access works (refresh pages)
4. ✅ Auth redirect works (try accessing /dashboard)
5. ✅ Console has no critical errors

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Blank page | Check browser console, likely env vars missing |
| 404 on refresh | SPA routing not configured |
| "Configuration Error" | Set required env vars |
| TypeScript errors on build | Run `npm run typecheck` to find issues |
| Tests fail | Run `npm run test:e2e:ui` for detailed report |

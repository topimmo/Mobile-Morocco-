# Mobile Morocco Platform

A marketplace platform for buying and selling mobile phones, accessories, and repair services in Morocco.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Production Deployment Checklist

### Before Deploying

1. **Run the deploy check** (REQUIRED - will fail if issues are detected):
   ```bash
   npm run deploy:check
   ```
   This command runs:
   - TypeScript type checking
   - Production build
   - End-to-end smoke tests against production build

2. **Verify environment variables** are set in your hosting provider:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key

### Vercel Deployment

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy - `vercel.json` handles SPA routing automatically

### Hostinger Deployment

1. Run `npm run build` locally
2. Upload the `dist/` folder contents to your `public_html` directory
3. **IMPORTANT:** The `.htaccess` file in `public/` is included in the build and handles SPA routing
4. If routes still don't work, ensure `.htaccess` was uploaded and mod_rewrite is enabled

#### Hostinger SPA Routing Fix

The `public/.htaccess` file contains:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>
```

If this doesn't work:
1. Check if mod_rewrite is enabled (contact Hostinger support)
2. Ensure the `.htaccess` file is in the root of your `public_html`
3. Clear browser cache and try again

### Netlify Deployment

The `public/_redirects` file handles SPA routing automatically.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test:e2e` | Run Playwright smoke tests |
| `npm run deploy:check` | Full pre-deployment validation |
| `npm run deploy:preview` | Build and preview locally |

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Architecture

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Routing:** React Router v6 (client-side SPA)

## Troubleshooting

### "App logic stops working in production"

1. Check browser console for errors
2. Verify environment variables are set correctly
3. Run `npm run deploy:check` to catch issues before deploying

### "Routes show 404 on refresh"

This is a SPA routing issue. Ensure:
- Hostinger: `.htaccess` is in place with mod_rewrite rules
- Vercel: `vercel.json` has the rewrite rule
- Netlify: `_redirects` file exists in `public/`

### "Blank page in production"

1. Check browser console for JavaScript errors
2. Verify the build completed without errors (`npm run build`)
3. Check that environment variables are set in production

# Mobile Morocco Platform

A marketplace platform for buying and selling mobile phones, computers, accessories, and repair services in Morocco.

## Features

### Product Categories
- **📱 Mobile Phones**: Buy and sell new and used smartphones with detailed specifications
- **💻 Computers**: Browse and publish computer listings (laptops, desktops) with specs like CPU, RAM, GPU, Storage
- **🔧 Spare Parts**: Find mobile and computer parts
- **🛠️ Repair Services**: Connect with repair shops and technicians
- **📦 Equipment**: Browse mobile and computer equipment

### Key Routes
- `/phones` - Browse all phone listings
- `/publish-phone` - Publish a phone listing (requires login)
- `/computers` - Browse all computer listings
- `/publish-computer` - Publish a computer listing (requires login)
- `/computer-parts` - Browse computer parts
- `/publish-computer-part` - Publish a computer part listing (requires login)
- `/items/:slug` - View detailed item page with SEO metadata
- `/stores` - Browse stores and sellers
- `/repair-shops` - Find repair services

### SEO Features
- ✅ Meta tags (title, description, keywords) on all pages
- ✅ Open Graph tags for social media sharing
- ✅ JSON-LD structured data (Product schema) on item detail pages
- ✅ Canonical URLs for better indexing
- ✅ Multilingual support (Arabic, French, English)

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

## Security

This platform implements comprehensive security measures to protect user data:

- **✅ Row Level Security (RLS)**: All database tables are protected with RLS policies
- **✅ Rate Limiting**: Database-level rate limits prevent spam and abuse
- **✅ Storage Security**: User-specific folder access prevents unauthorized file operations
- **✅ Data Validation**: CHECK constraints prevent empty/invalid content
- **✅ Authentication**: Secure auth via Supabase with email/password and OTP verification
- **✅ Role-Based Access**: Admin, seller, repair shop, advertiser, and user roles
- **✅ Content Moderation**: Admin approval required for public content

**📖 For detailed security documentation, see [SECURITY.md](./SECURITY.md)**

### Security Statement

**With Row Level Security enabled on all tables, no unauthorized user can read or write protected data.** All database access is enforced at the PostgreSQL level, ensuring security even if client-side code is bypassed.

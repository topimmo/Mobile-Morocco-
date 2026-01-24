# Vercel Deployment Guide

This guide covers everything you need to deploy the Mobile Morocco platform to Vercel.

## 🚀 Quick Start

### 1. Prerequisites
- A Vercel account (sign up at [vercel.com](https://vercel.com))
- A Supabase project (sign up at [supabase.com](https://supabase.com))
- GitHub repository access

### 2. Connect to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure the project (see below)

## ⚙️ Configuration

### Framework & Build Settings

Vercel should auto-detect these settings from `vercel.json`, but verify:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node.js Version**: 20.x (specified in `.nvmrc`)

### Environment Variables (Required)

In your Vercel project dashboard, add these environment variables:

#### Required Variables

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Supabase Dashboard → Settings → API → Project API keys → `anon` `public` |

#### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_APP_ENV` | `production` | Application environment |
| `VITE_BASE_URL` | `/` | Base URL for the app |
| `VITE_ADMIN_ADS_EMAIL` | - | Admin email for ad requests |
| `VITE_FROM_EMAIL` | - | From email for notifications |
| `VITE_RESEND_API_KEY` | - | Resend API key for emails |

### Setting Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with its value
4. Select **Production**, **Preview**, and **Development** environments
5. Click **Save**

## 🔒 Security

### Headers Configuration

The following security headers are automatically configured in `vercel.json`:

- ✅ **X-Frame-Options**: Prevents clickjacking
- ✅ **X-Content-Type-Options**: Prevents MIME sniffing
- ✅ **X-XSS-Protection**: Enables XSS filter
- ✅ **Content-Security-Policy**: Restricts resource loading
- ✅ **Referrer-Policy**: Controls referrer information
- ✅ **Permissions-Policy**: Restricts browser features

**Note on CSP**: The Content-Security-Policy includes `unsafe-inline` and `unsafe-eval` directives which are required by Vite's development mode and React's runtime. While these reduce security strictness, they are necessary for the application to function. The CSP still provides protection by restricting:
- Default sources to same-origin only
- Image sources to self, data URLs, and HTTPS
- Connection sources to self and Supabase domains
- Frame ancestors to self only

### Environment Variable Security

- ✅ All `VITE_*` variables are exposed to the client (safe for public keys)
- ❌ **Never** use `VITE_` prefix for secret keys
- ❌ **Never** commit actual values to `.env` (use `.env.example`)
- ✅ Server-side secrets should be set in Vercel dashboard only

## 🎯 Deployment Process

### Automatic Deployments

Vercel automatically deploys:
- **Production**: Commits to `main` branch
- **Preview**: Pull requests and other branches

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Deploy preview
vercel
```

## ✅ Post-Deployment Checklist

After deploying, verify these items:

### Functionality Tests

- [ ] Homepage loads correctly
- [ ] Navigation works (all menu items)
- [ ] Direct URL access works (e.g., `/phones`, `/stores`)
- [ ] Page refresh doesn't cause 404 errors
- [ ] Authentication flow works
- [ ] Supabase connection works
- [ ] Images and assets load
- [ ] Search functionality works
- [ ] Filters work correctly

### Performance Tests

Visit [PageSpeed Insights](https://pagespeed.web.dev/) with your Vercel URL:

- [ ] Performance score > 80
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID (First Input Delay) < 100ms
- [ ] CLS (Cumulative Layout Shift) < 0.1

### Security Tests

- [ ] Security headers present (check in Network tab)
- [ ] No console errors in production
- [ ] Admin routes not publicly accessible
- [ ] Environment variables not exposed in client

### SEO Tests

- [ ] `robots.txt` accessible at `/robots.txt`
- [ ] `sitemap.xml` accessible at `/sitemap.xml`
- [ ] Meta tags present on all pages
- [ ] Social media previews work (Open Graph, Twitter Cards)

## 🐛 Troubleshooting

### Build Failures

**Error**: `Cannot find module 'react'`
- **Solution**: Check that `package.json` dependencies are correct
- Run `npm install` locally to verify

**Error**: TypeScript compilation errors
- **Solution**: Run `npm run typecheck` locally first
- Fix any type errors before deploying

### Runtime Errors

**Error**: "Configuration Error" page shows
- **Solution**: Missing environment variables
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel dashboard

**Error**: 404 on page refresh
- **Solution**: SPA routing not working
- Verify `vercel.json` has the rewrite rule (should be automatic)

**Error**: Supabase connection fails
- **Solution**: Check environment variables
- Verify CORS settings in Supabase dashboard

### Performance Issues

**Issue**: Slow initial page load
- Check bundle sizes: `npm run build` and review output
- Verify assets are being cached (check Cache-Control headers)
- Use Vercel Analytics to identify bottlenecks

**Issue**: Large bundle sizes
- The app uses code splitting for better performance
- Largest chunks should be lazy-loaded routes
- Main vendor bundle should be ~165KB (gzipped ~54KB)

## 📊 Monitoring

### Vercel Analytics

Enable Vercel Analytics in your project dashboard:
1. Go to **Analytics** tab
2. Enable **Web Analytics**
3. View real user metrics (Core Web Vitals)

### Error Tracking

Check Vercel Function Logs:
1. Go to **Deployments** → Select deployment
2. Click **View Function Logs**
3. Monitor for runtime errors

### Performance Monitoring

Monitor these metrics in Vercel Analytics:
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)

## 🔄 Rolling Back

If a deployment has issues:

1. Go to **Deployments** in Vercel dashboard
2. Find the previous working deployment
3. Click **⋯** → **Promote to Production**

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Supabase Documentation](https://supabase.com/docs)
- [Project Repository](https://github.com/topimmo/Mobile-Morocco-)

## 🆘 Support

If you encounter issues:

1. Check Vercel Function Logs
2. Review this guide's troubleshooting section
3. Check the main `DEPLOYMENT.md` for general deployment info
4. Open an issue in the GitHub repository

---

**Last Updated**: January 2026
**Vercel Framework**: Vite 6.2.3
**Node.js Version**: 20.x

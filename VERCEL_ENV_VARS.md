# Vercel Environment Variables Setup

## Required Environment Variables

These MUST be set in Vercel for the application to work:

### 1. VITE_SUPABASE_URL
- **Description**: Your Supabase project URL
- **Example**: `https://xxxxxxxxxxx.supabase.co`
- **Where to find**: Supabase Dashboard → Settings → API → Project URL
- **Environment**: Production, Preview, Development

### 2. VITE_SUPABASE_ANON_KEY
- **Description**: Your Supabase anonymous/public key
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Where to find**: Supabase Dashboard → Settings → API → Project API keys → `anon` `public`
- **Environment**: Production, Preview, Development

---

## Optional Environment Variables

### Application Settings

#### VITE_APP_ENV
- **Description**: Application environment mode
- **Default**: `production`
- **Possible values**: `development`, `production`, `test`
- **Environment**: Set to `production` for production

#### VITE_BASE_URL
- **Description**: Base URL for the application
- **Default**: `/`
- **Environment**: Usually keep default

### Email Configuration (For Ad Requests)

#### VITE_ADMIN_ADS_EMAIL
- **Description**: Admin email to receive ad requests
- **Example**: `admin@mobilemaroc.ma`
- **Environment**: Production, Preview

#### VITE_FROM_EMAIL
- **Description**: From email address for notifications
- **Example**: `noreply@mobilemaroc.ma`
- **Environment**: Production, Preview

#### VITE_RESEND_API_KEY
- **Description**: Resend API key for email sending
- **Note**: Falls back to mailto links if not set
- **Example**: `re_xxxxxxxxxxxx`
- **Environment**: Production

---

## How to Set in Vercel

### Via Dashboard

1. Go to your Vercel project
2. Click **Settings** tab
3. Click **Environment Variables** in left sidebar
4. For each variable:
   - Enter **Key** (variable name)
   - Enter **Value** (variable value)
   - Select environments:
     - ✅ **Production** - Used in production builds
     - ✅ **Preview** - Used in PR preview builds
     - ✅ **Development** - Used when running locally via `vercel dev`
   - Click **Save**

### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add VITE_SUPABASE_URL production
# Paste value when prompted

vercel env add VITE_SUPABASE_ANON_KEY production
# Paste value when prompted
```

---

## Validation

After setting environment variables, you can validate them:

### 1. Check Build Logs
- Deploy your project
- Check build logs for any environment validation errors
- Look for: "Missing required environment variables"

### 2. Test in Preview
- Create a preview deployment
- Visit the preview URL
- If you see "Configuration Error" page, environment variables are missing

### 3. Check Production
- Visit your production URL
- Open browser console
- No errors should appear related to Supabase connection

---

## Security Best Practices

### ✅ Safe to Expose (VITE_* prefix)
These are bundled into your client-side code and are PUBLIC:
- `VITE_SUPABASE_URL` - Public URL, safe to expose
- `VITE_SUPABASE_ANON_KEY` - Anonymous key with Row Level Security, safe to expose
- `VITE_APP_ENV` - Safe to expose
- Any other `VITE_*` variables

### ❌ NEVER Expose (No VITE_ prefix)
These should NEVER use the `VITE_` prefix:
- Database passwords
- `SUPABASE_SERVICE_KEY` (service role key)
- Private API keys
- Authentication secrets

### Key Points
1. **Only use `VITE_` prefix for public values**
2. **Never commit actual values to git** (use .env.example)
3. **Rotate keys if accidentally exposed**
4. **Use Supabase Row Level Security** to protect data

---

## Troubleshooting

### "Configuration Error" page appears

**Cause**: Required environment variables not set

**Solution**:
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Redeploy the application

### Supabase connection fails

**Symptoms**: 
- Network errors in console
- "Failed to fetch" errors
- Data not loading

**Solution**:
1. Check that `VITE_SUPABASE_URL` is correct
2. Check that `VITE_SUPABASE_ANON_KEY` is correct
3. Verify CORS settings in Supabase Dashboard
4. Check Supabase service status

### Environment variables not updating

**Cause**: Variables are bundled at build time

**Solution**:
1. Update variables in Vercel Dashboard
2. **Trigger a new deployment** (required!)
3. Don't just save - you must redeploy

### Different values for Preview vs Production

**Use case**: Testing with different Supabase projects

**Solution**:
1. Add variable for **Production** environment with production values
2. Add same variable for **Preview** environment with staging values
3. Each deployment will use the appropriate value

---

## Quick Setup Checklist

- [ ] Create Supabase project
- [ ] Copy Supabase URL and Anon Key
- [ ] Add `VITE_SUPABASE_URL` in Vercel
- [ ] Add `VITE_SUPABASE_ANON_KEY` in Vercel
- [ ] Select Production, Preview, Development environments
- [ ] Save variables
- [ ] Trigger deployment
- [ ] Verify app loads without errors
- [ ] Test authentication flow
- [ ] Test data loading

---

## Support

If you have issues with environment variables:

1. Check this guide's troubleshooting section
2. Review Vercel build logs
3. Check browser console for errors
4. See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for full deployment guide

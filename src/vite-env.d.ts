/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  // Automatic environment variables provided by Vercel
  readonly VERCEL_GIT_COMMIT_SHA?: string
  // Automatic environment variables provided by GitHub Actions
  readonly GITHUB_SHA?: string
}

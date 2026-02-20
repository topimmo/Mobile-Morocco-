import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  // Expose Vercel and GitHub automatic environment variables
  define: {
    'import.meta.env.VERCEL_GIT_COMMIT_SHA': JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA || ''),
    'import.meta.env.GITHUB_SHA': JSON.stringify(process.env.GITHUB_SHA || ''),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Ensure source maps for debugging production issues
    sourcemap: true,
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Supabase client
          supabase: ['@supabase/supabase-js'],
          // Large UI library
          radix: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-popover',
            '@radix-ui/react-toast',
          ],
          // Form handling
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          // i18n
          i18n: ['i18next', 'react-i18next'],
        },
      },
    },
    // Increase chunk size warning limit for large dependencies
    chunkSizeWarningLimit: 600,
    // Enable minification
    minify: 'esbuild',
    // Target modern browsers for smaller bundle
    target: 'es2020',
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
  server: {
    // @ts-expect-error - TEMPO allowedHosts uses boolean which is not in standard Vite types
    allowedHosts: process.env.TEMPO === "true" ? true : undefined,
    host: process.env.TEMPO === "true" ? '0.0.0.0' : undefined
  }
});
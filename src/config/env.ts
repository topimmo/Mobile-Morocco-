/**
 * Environment Configuration
 * Single source of truth for all environment variables.
 * Validates required variables at runtime startup.
 */

// Required environment variables for the app to function
const REQUIRED_ENV_VARS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
] as const;

// Optional environment variables with defaults
const OPTIONAL_ENV_VARS = {
  VITE_APP_ENV: 'production',
  VITE_BASE_URL: '/',
  VITE_SITE_URL: '', // Production URL for auth redirects
  VITE_SUPPORT_EMAIL: 'support@mobilemorocco.com', // Support email for user contact
} as const;

export interface EnvConfig {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  APP_ENV: 'development' | 'production' | 'test';
  BASE_URL: string;
  SITE_URL: string; // Production URL (e.g., https://mobilemorocco.com)
  SUPPORT_EMAIL: string; // Support email address
  IS_PRODUCTION: boolean;
  IS_DEVELOPMENT: boolean;
}

class EnvValidationError extends Error {
  constructor(missingVars: string[]) {
    super(
      `Missing required environment variables: ${missingVars.join(', ')}.\n` +
      `Please check your .env file or hosting environment configuration.\n` +
      `Required variables: ${REQUIRED_ENV_VARS.join(', ')}`
    );
    this.name = 'EnvValidationError';
  }
}

function validateEnv(): EnvConfig {
  const missingVars: string[] = [];

  // Check required variables
  for (const varName of REQUIRED_ENV_VARS) {
    if (!import.meta.env[varName]) {
      missingVars.push(varName);
    }
  }

  // If any required vars are missing, throw with clear error
  if (missingVars.length > 0) {
    const error = new EnvValidationError(missingVars);
    console.error('🚨 Environment Configuration Error:', error.message);
    throw error;
  }

  const appEnv = (import.meta.env.VITE_APP_ENV || OPTIONAL_ENV_VARS.VITE_APP_ENV) as 'development' | 'production' | 'test';

  return {
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    APP_ENV: appEnv,
    BASE_URL: import.meta.env.BASE_URL || OPTIONAL_ENV_VARS.VITE_BASE_URL,
    SITE_URL: import.meta.env.VITE_SITE_URL || OPTIONAL_ENV_VARS.VITE_SITE_URL,
    SUPPORT_EMAIL: import.meta.env.VITE_SUPPORT_EMAIL || OPTIONAL_ENV_VARS.VITE_SUPPORT_EMAIL,
    IS_PRODUCTION: appEnv === 'production' || import.meta.env.PROD,
    IS_DEVELOPMENT: appEnv === 'development' || import.meta.env.DEV,
  };
}

// Validate and export config singleton
// This will throw immediately if env vars are missing
let envConfig: EnvConfig;

try {
  envConfig = validateEnv();
} catch (error) {
  // In case of validation error, create a minimal config that shows error UI
  // This allows the app to render an error page instead of a blank screen
  envConfig = {
    SUPABASE_URL: '',
    SUPABASE_ANON_KEY: '',
    APP_ENV: 'production',
    BASE_URL: '/',
    SITE_URL: '',
    IS_PRODUCTION: true,
    IS_DEVELOPMENT: false,
  };
  
  // Re-throw to be caught by error boundary
  if (typeof window !== 'undefined') {
    // Set a global flag for the error boundary to detect
    (window as any).__ENV_VALIDATION_ERROR__ = error;
  }
}

export const env = envConfig;

// Helper to check if env is properly configured
export function isEnvValid(): boolean {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);
}

// Helper to get the site URL for auth redirects
export function getSiteUrl(): string {
  // Use VITE_SITE_URL if set, otherwise fall back to window.location.origin
  if (env.SITE_URL) {
    return env.SITE_URL;
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // In production, we should have SITE_URL set. If not, throw error.
  if (env.IS_PRODUCTION) {
    throw new Error(
      'SITE_URL not configured in production environment. ' +
      'Please set VITE_SITE_URL in your hosting environment.'
    );
  }
  // Fallback for development/SSR
  return 'http://localhost:5173';
}

// Helper to get support email
export function getSupportEmail(): string {
  return env.SUPPORT_EMAIL || 'support@mobilemorocco.com';
}

// Export the validation error for use in error boundaries
export { EnvValidationError };
export default env;

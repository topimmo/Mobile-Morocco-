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
} as const;

export interface EnvConfig {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  APP_ENV: 'development' | 'production' | 'test';
  BASE_URL: string;
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

// Export the validation error for use in error boundaries
export { EnvValidationError };
export default env;

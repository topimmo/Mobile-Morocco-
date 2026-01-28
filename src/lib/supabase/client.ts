import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { env, isEnvValid } from '@/config/env';
import { logger } from '@/lib/logger';

// Use centralized env config for Supabase credentials
const supabaseUrl = env.SUPABASE_URL;
const supabaseAnonKey = env.SUPABASE_ANON_KEY;

if (!isEnvValid()) {
  console.warn(
    '⚠️ Supabase credentials not configured.\n' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
  );
}

// Generate a correlation ID for request tracing
export function generateCorrelationId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        // Add correlation ID to all requests for tracing
        'x-correlation-id': generateCorrelationId(),
      },
    },
  }
);

// Log all Supabase operations in development
if (env.IS_DEVELOPMENT) {
  const originalFrom = supabase.from.bind(supabase);
  supabase.from = function(table: any) {
    const correlationId = generateCorrelationId();
    logger.debug(`📊 Supabase query: ${table}`, { correlationId });
    return originalFrom(table);
  };
}

export const isSupabaseConfigured = (): boolean => {
  return isEnvValid() && 
    supabaseUrl.startsWith('http') && 
    supabaseAnonKey.length > 20;
};

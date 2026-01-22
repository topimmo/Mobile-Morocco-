import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { env, isEnvValid } from '@/config/env';

// Use centralized env config for Supabase credentials
const supabaseUrl = env.SUPABASE_URL;
const supabaseAnonKey = env.SUPABASE_ANON_KEY;

if (!isEnvValid()) {
  console.warn(
    '⚠️ Supabase credentials not configured.\n' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
  );
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
  }
);

export const isSupabaseConfigured = (): boolean => {
  return isEnvValid() && 
    supabaseUrl.startsWith('http') && 
    supabaseAnonKey.length > 20;
};

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase Environment Check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl ? 'Set' : 'Missing',
  key: supabaseAnonKey ? 'Set' : 'Missing'
});

const createFallbackSupabaseClient = () => ({
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({
      data: {
        subscription: {
          unsubscribe: () => undefined
        }
      }
    }),
    signUp: async () => ({ error: { message: 'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' } }),
    signInWithPassword: async () => ({ error: { message: 'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' } }),
    updateUser: async () => ({ error: { message: 'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' } }),
    signOut: async () => ({ error: null }),
    signInWithOAuth: async () => ({ error: { message: 'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.' } })
  }
});

// Create supabase client or safe fallback client
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables:', {
      VITE_SUPABASE_URL: supabaseUrl ? 'Set' : 'Missing',
      VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'Set' : 'Missing'
    });

    // Return a minimal mock with the same shape used by AuthContext.
    return createFallbackSupabaseClient();
  } else {
    console.log('Creating Supabase client...');
    const client = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client created successfully');
    return client;
  }
};

export const supabase = createSupabaseClient();

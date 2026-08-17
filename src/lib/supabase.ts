import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Auth (login/signup/dashboard) uses Supabase when configured.
 * Flight search does not use Supabase — missing env must not break the app.
 */
const createFallbackSupabaseClient = () =>
  ({
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe: () => undefined,
          },
        },
      }),
      signUp: async () => ({
        error: { message: "Sign-in is temporarily unavailable." },
      }),
      signInWithPassword: async () => ({
        error: { message: "Sign-in is temporarily unavailable." },
      }),
      updateUser: async () => ({
        error: { message: "Sign-in is temporarily unavailable." },
      }),
      signOut: async () => ({ error: null }),
      signInWithOAuth: async () => ({
        error: { message: "Sign-in is temporarily unavailable." },
      }),
    },
  }) as unknown as SupabaseClient;

const createSupabaseClient = (): SupabaseClient => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return createFallbackSupabaseClient();
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createSupabaseClient();

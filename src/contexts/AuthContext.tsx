import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    details: {
      fullName: string;
      phone?: string;
      source?: string;
    }
  ) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  signInWithGoogle: (redirectTo?: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Initializing...');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('AuthProvider: Initial session check', { session: !!session, error });
      if (error) {
        console.error('AuthProvider: Session error:', error);
      }
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch((error) => {
      console.error('AuthProvider: Failed to get session:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('AuthProvider: Auth state changed', { event: _event, session: !!session });
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('AuthProvider: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string,
    password: string,
    details: {
      fullName: string;
      phone?: string;
      source?: string;
    }
  ) => {
    console.log('AuthProvider: Sign up attempt for', email);
    try {
      const signupDetails = {
        full_name: details.fullName,
        phone: details.phone || null,
        email,
        source: details.source || 'email_password',
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...signupDetails,
            signup_details: signupDetails,
          },
        },
      });

      if (error) {
        console.error('AuthProvider: Sign up error:', error);
        return { error: error.message };
      }

      console.log('AuthProvider: Sign up successful');
      return { error: null };
    } catch (error) {
      console.error('AuthProvider: Sign up exception:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider: Sign in attempt for', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('AuthProvider: Sign in error:', error);
        return { error: error.message };
      }

      if (data.user) {
        const metadata = data.user.user_metadata || {};
        const signInHistory = Array.isArray(metadata.signin_history) ? metadata.signin_history : [];
        const signInEvent = {
          at: new Date().toISOString(),
          source: 'email_password',
          email,
        };

        await supabase.auth.updateUser({
          data: {
            ...metadata,
            last_signin_details: signInEvent,
            signin_history: [...signInHistory.slice(-9), signInEvent],
          },
        });
      }

      console.log('AuthProvider: Sign in successful');
      return { error: null };
    } catch (error) {
      console.error('AuthProvider: Sign in exception:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    console.log('AuthProvider: Sign out attempt');
    try {
      await supabase.auth.signOut();
      console.log('AuthProvider: Sign out successful');
    } catch (error) {
      console.error('AuthProvider: Sign out error:', error);
    }
  };

  const signInWithGoogle = async (redirectTo?: string) => {
    try {
      const resolvedRedirectTo = redirectTo
        ? `${window.location.origin}${redirectTo.startsWith('/') ? redirectTo : `/${redirectTo}`}`
        : undefined;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: resolvedRedirectTo ? { redirectTo: resolvedRedirectTo } : undefined,
      });
      if (error) {
        console.error('AuthProvider: Google sign-in error:', error);
        return { error: error.message };
      }
      return { error: null };
    } catch (error) {
      console.error('AuthProvider: Google sign-in exception:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
  };

  console.log('AuthProvider: Rendering with state', { user: !!user, loading });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

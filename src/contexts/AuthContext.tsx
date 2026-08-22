import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getAuthToken,
  loginRequest,
  meRequest,
  setAuthToken,
  signupRequest,
  type AuthUser,
} from "@/lib/authApi";

interface AuthContextType {
  user: AuthUser | null;
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    meRequest(token)
      .then((u) => {
        if (!active) return;
        setUser(u);
      })
      .catch(() => {
        if (!active) return;
        setAuthToken(null);
        setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
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
    try {
      const { token, user: created } = await signupRequest({
        email,
        password,
        fullName: details.fullName,
        phone: details.phone,
        source: details.source || "email_password",
      });
      setAuthToken(token);
      setUser(created);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "An unexpected error occurred" };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { token, user: loggedIn } = await loginRequest({ email, password });
      setAuthToken(token);
      setUser(loggedIn);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "An unexpected error occurred" };
    }
  };

  const signOut = async () => {
    setAuthToken(null);
    setUser(null);
  };

  const signInWithGoogle = async () => {
    return {
      error: "Google sign-in is not available. Please use email and password.",
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

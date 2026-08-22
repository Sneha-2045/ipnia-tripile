import { getApiBase } from "@/lib/apiBase";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  source?: string;
  lastSignInAt?: string | null;
  createdAt?: string;
};

type AuthResponse = {
  success: boolean;
  token?: string;
  user?: AuthUser;
  message?: string;
  errors?: string[];
};

const TOKEN_KEY = "ipnia_auth_token";

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

export async function signupRequest(payload: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  source?: string;
}): Promise<{ token: string; user: AuthUser }> {
  const res = await fetch(`${getApiBase()}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as AuthResponse;
  if (!res.ok || !data.success || !data.token || !data.user) {
    throw new Error(data.message || data.errors?.[0] || "Sign up failed");
  }
  return { token: data.token, user: data.user };
}

export async function loginRequest(payload: {
  email: string;
  password: string;
}): Promise<{ token: string; user: AuthUser }> {
  const res = await fetch(`${getApiBase()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as AuthResponse;
  if (!res.ok || !data.success || !data.token || !data.user) {
    throw new Error(data.message || data.errors?.[0] || "Login failed");
  }
  return { token: data.token, user: data.user };
}

export async function meRequest(token: string): Promise<AuthUser> {
  const res = await fetch(`${getApiBase()}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = (await res.json()) as AuthResponse;
  if (!res.ok || !data.success || !data.user) {
    throw new Error(data.message || "Session expired");
  }
  return data.user;
}

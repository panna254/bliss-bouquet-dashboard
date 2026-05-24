import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabaseClient";

export type AuthRole = "customer" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: AuthRole;
}

export interface AuthProfile {
  id: string;
  email: string;
  fullName?: string;
  role: AuthRole;
}

export interface AuthSession {
  user: AuthUser;
  profile: AuthProfile | null;
  accessToken: string;
  expiresAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  fullName: string;
}

export interface AuthServiceError {
  message: string;
  code?: string;
}

export interface AuthServiceResult<T> {
  data: T | null;
  error: AuthServiceError | null;
}

export interface AuthService {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  signup(credentials: SignupCredentials): Promise<AuthSession>;
  logout(): Promise<void>;
  getCurrentSession(): Promise<AuthSession | null>;
  requireAdminSession(): Promise<AuthSession>;
}

export type AdminVerificationFailureCode = "unauthenticated" | "unauthorized";

export class AdminVerificationError extends Error {
  code: AdminVerificationFailureCode;

  constructor(message: string, code: AdminVerificationFailureCode) {
    super(message);
    this.name = "AdminVerificationError";
    this.code = code;
  }
}

interface ProfileRow {
  id?: string | null;
  full_name: string | null;
  email: string | null;
  role: AuthRole | null;
}

const authSuccess = <T>(data: T): AuthServiceResult<T> => ({
  data,
  error: null,
});

const authFailure = <T>(message: string, code?: string): AuthServiceResult<T> => ({
  data: null,
  error: {
    message,
    code,
  },
});

const normalizeAuthError = (fallbackMessage: string, error: unknown): AuthServiceError => {
  if (error instanceof Error) {
    return {
      message: error.message || fallbackMessage,
      code: "code" in error && typeof error.code === "string" ? error.code : undefined,
    };
  }

  return {
    message: fallbackMessage,
  };
};

const getMetadataName = (user: User): string | undefined => {
  const metadata = user.user_metadata as Record<string, unknown>;
  const name = metadata.full_name ?? metadata.name;

  return typeof name === "string" && name.trim() ? name : undefined;
};

const getProfileForUser = async (userId: string): Promise<AuthServiceResult<ProfileRow | null>> => {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id,full_name,email,role")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    const normalizedError = normalizeAuthError("Unable to load user profile.", error);
    return authFailure(normalizedError.message, normalizedError.code);
  }

  return authSuccess((data as ProfileRow | null) ?? null);
};

const resolveUserRole = (profile: ProfileRow | null): AuthRole => (profile?.role === "admin" ? "admin" : "customer");

const toAuthUser = (user: User, profile: ProfileRow | null): AuthUser => ({
  id: user.id,
  email: profile?.email ?? user.email ?? "",
  name: profile?.full_name ?? getMetadataName(user),
  role: resolveUserRole(profile),
});

const toAuthProfile = (user: User, profile: ProfileRow | null): AuthProfile | null => {
  if (!profile) {
    return null;
  }

  return {
    id: profile.id ?? user.id,
    email: profile.email ?? user.email ?? "",
    fullName: profile.full_name ?? undefined,
    role: resolveUserRole(profile),
  };
};

const toAuthSession = async (session: Session): Promise<AuthServiceResult<AuthSession>> => {
  const profileResult = await getProfileForUser(session.user.id);

  if (profileResult.error) {
    return authFailure(profileResult.error.message, profileResult.error.code);
  }

  return authSuccess({
    user: toAuthUser(session.user, profileResult.data),
    profile: toAuthProfile(session.user, profileResult.data),
    accessToken: session.access_token,
    expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : "",
  });
};

export async function signIn(credentials: LoginCredentials): Promise<AuthServiceResult<AuthSession>> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      const normalizedError = normalizeAuthError("Unable to sign in.", error);
      return authFailure(normalizedError.message, normalizedError.code);
    }

    if (!data.session) {
      return authFailure("Unable to sign in. No active session was returned.");
    }

    return toAuthSession(data.session);
  } catch (error) {
    const normalizedError = normalizeAuthError("Unable to sign in.", error);
    return authFailure(normalizedError.message, normalizedError.code);
  }
}

export async function signUp(credentials: SignupCredentials): Promise<AuthServiceResult<AuthSession>> {
  try {
    const supabase = getSupabaseClient();
    const fullName = credentials.fullName.trim();
    const email = credentials.email.trim();

    const { data, error } = await supabase.auth.signUp({
      email,
      password: credentials.password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      const normalizedError = normalizeAuthError("Unable to create account.", error);
      return authFailure(normalizedError.message, normalizedError.code);
    }

    if (!data.user) {
      return authFailure("Unable to create account. No user was returned.");
    }

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      full_name: fullName,
      email,
      role: "customer",
    });

    if (profileError) {
      const normalizedError = normalizeAuthError("Account was created but profile setup failed.", profileError);
      return authFailure(normalizedError.message, normalizedError.code);
    }

    if (!data.session) {
      return authFailure("Account created. Please confirm your email before signing in.");
    }

    return toAuthSession(data.session);
  } catch (error) {
    const normalizedError = normalizeAuthError("Unable to create account.", error);
    return authFailure(normalizedError.message, normalizedError.code);
  }
}

export async function signOut(): Promise<AuthServiceResult<void>> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      const normalizedError = normalizeAuthError("Unable to sign out.", error);
      return authFailure(normalizedError.message, normalizedError.code);
    }

    return authSuccess(undefined);
  } catch (error) {
    const normalizedError = normalizeAuthError("Unable to sign out.", error);
    return authFailure(normalizedError.message, normalizedError.code);
  }
}

export async function getCurrentUser(): Promise<AuthServiceResult<AuthUser | null>> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      const normalizedError = normalizeAuthError("Unable to load current user.", error);
      return authFailure(normalizedError.message, normalizedError.code);
    }

    if (!data.session) {
      return authSuccess(null);
    }

    const profileResult = await getProfileForUser(data.session.user.id);

    if (profileResult.error) {
      return authFailure(profileResult.error.message, profileResult.error.code);
    }

    return authSuccess(toAuthUser(data.session.user, profileResult.data));
  } catch (error) {
    const normalizedError = normalizeAuthError("Unable to load current user.", error);
    return authFailure(normalizedError.message, normalizedError.code);
  }
}

export async function isAdmin(): Promise<AuthServiceResult<boolean>> {
  try {
    await requireAdminSession();
    return authSuccess(true);
  } catch (error) {
    if (error instanceof AdminVerificationError) {
      return authSuccess(false);
    }

    const normalizedError = normalizeAuthError("Unable to verify admin session.", error);
    return authFailure(normalizedError.message, normalizedError.code);
  }
}

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  const result = await signIn(credentials);

  if (result.error || !result.data) {
    throw new Error(result.error?.message ?? "Unable to sign in.");
  }

  return result.data;
}

export async function signup(credentials: SignupCredentials): Promise<AuthSession> {
  const result = await signUp(credentials);

  if (result.error || !result.data) {
    throw new Error(result.error?.message ?? "Unable to create account.");
  }

  return result.data;
}

export async function logout(): Promise<void> {
  const result = await signOut();

  if (result.error) {
    throw new Error(result.error.message);
  }
}

export async function getCurrentSession(): Promise<AuthSession | null> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      const normalizedError = normalizeAuthError("Unable to load current session.", error);
      throw new Error(normalizedError.message);
    }

    if (!data.session) {
      return null;
    }

    const sessionResult = await toAuthSession(data.session);

    if (sessionResult.error) {
      throw new Error(sessionResult.error.message);
    }

    return sessionResult.data;
  } catch (error) {
    const normalizedError = normalizeAuthError("Unable to load current session.", error);
    throw new Error(normalizedError.message);
  }
}

export async function requireAdminSession(): Promise<AuthSession> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    const normalizedError = normalizeAuthError("Unable to load current session.", error);
    throw new Error(normalizedError.message);
  }

  if (!data.session) {
    throw new AdminVerificationError("An authenticated admin session is required.", "unauthenticated");
  }

  const profileResult = await getProfileForUser(data.session.user.id);

  if (profileResult.error) {
    throw new Error(profileResult.error.message);
  }

  if (profileResult.data?.role !== "admin") {
    throw new AdminVerificationError("An admin role is required.", "unauthorized");
  }

  return {
    user: toAuthUser(data.session.user, profileResult.data),
    profile: toAuthProfile(data.session.user, profileResult.data),
    accessToken: data.session.access_token,
    expiresAt: data.session.expires_at ? new Date(data.session.expires_at * 1000).toISOString() : "",
  };
}

export type AuthStateChangeUnsubscribe = () => void;
export type AuthStateChangeHandler = (event: AuthChangeEvent) => void;

export const subscribeToAuthStateChanges = (onChange: AuthStateChangeHandler): AuthStateChangeUnsubscribe => {
  const supabase = getSupabaseClient();
  const { data } = supabase.auth.onAuthStateChange((event) => {
    window.setTimeout(() => onChange(event), 0);
  });

  return () => {
    data.subscription.unsubscribe();
  };
};

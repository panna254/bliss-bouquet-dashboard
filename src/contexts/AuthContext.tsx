import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  getCurrentSession,
  logout,
  subscribeToAuthStateChanges,
  type AuthProfile,
  type AuthRole,
  type AuthSession,
  type AuthUser,
} from "@/services/auth.service";

interface AuthContextValue {
  user: AuthUser | null;
  profile: AuthProfile | null;
  role: AuthRole | null;
  loading: boolean;
  initialized: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<AuthSession | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const refreshSequence = useRef(0);

  const refreshSession = useCallback(async () => {
    const sequence = refreshSequence.current + 1;
    refreshSequence.current = sequence;
    setLoading(true);

    try {
      const nextSession = await getCurrentSession();

      if (refreshSequence.current === sequence) {
        setSession(nextSession);
      }

      return nextSession;
    } catch {
      if (refreshSequence.current === sequence) {
        setSession(null);
      }

      return null;
    } finally {
      if (refreshSequence.current === sequence) {
        setLoading(false);
        setInitialized(true);
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      await refreshSession();

      if (!isMounted) {
        return;
      }
    };

    initialize();

    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = subscribeToAuthStateChanges((event) => {
        if (isMounted && event !== "INITIAL_SESSION") {
          void refreshSession();
        }
      });
    } catch {
      unsubscribe = undefined;
    }

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, [refreshSession]);

  const signOut = useCallback(async () => {
    setLoading(true);

    try {
      await logout();
      setSession(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const user = session?.user ?? null;
    const profile = session?.profile ?? null;
    const role = user?.role ?? null;

    return {
      user,
      profile,
      role,
      loading,
      initialized,
      isAdmin: role === "admin",
      isAuthenticated: Boolean(user),
      signOut,
      refreshSession,
    };
  }, [initialized, loading, refreshSession, session, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

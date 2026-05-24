import type { AuthSession } from "@/services/auth.service";

const redirectStorageKey = "bliss-bouquet:auth-redirect:v1";
const sessionExpiredStorageKey = "bliss-bouquet:auth-session-expired:v1";

const publicFallbackPath = "/";
const adminFallbackPath = "/admin";

const blockedRedirectPrefixes = ["/login", "/signup", "/admin"];

export type AuthRedirectReason = "checkout" | "session_expired";

export const customerAuthMessages = {
  checkoutSignIn: "Please sign in to continue checkout.",
  sessionExpired: "Your session expired. Please sign in again.",
  ordersSignIn: "Please sign in to view your orders.",
} as const;

const isBlockedRedirectPath = (path: string): boolean =>
  blockedRedirectPrefixes.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`) || path.startsWith(`${prefix}?`),
  );

const isSafeRedirectPath = (path: string): boolean => {
  if (!path.startsWith("/") || path.startsWith("//")) {
    return false;
  }

  return !isBlockedRedirectPath(path);
};

const isInternalAuthErrorMessage = (message: string): boolean => {
  const normalized = message.toLowerCase();

  return (
    normalized.includes("unable to") ||
    normalized.includes("profile") ||
    normalized.includes("supabase") ||
    normalized.includes("no active session") ||
    normalized.includes("no user was returned")
  );
};

export const formatCustomerLoginError = (error: unknown): string => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (isInternalAuthErrorMessage(message)) {
      return "We couldn't sign you in right now. Please check your connection and try again.";
    }

    if (message.includes("invalid") || message.includes("password") || message.includes("email")) {
      return "That email or password doesn't look right. Please check and try again.";
    }
  }

  return "We couldn't sign you in right now. Please check your connection and try again.";
};

export const formatCustomerSignupError = (error: unknown): string => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (isInternalAuthErrorMessage(message)) {
      return "We couldn't create your account right now. Please try again in a moment.";
    }

    if (message.includes("already") || message.includes("duplicate") || message.includes("exists")) {
      return "An account with that email already exists. Try signing in instead.";
    }

    if (message.includes("confirm your email")) {
      return "Please confirm your email, then sign in to continue.";
    }
  }

  return "We couldn't create your account right now. Please try again in a moment.";
};

export const markSessionExpired = (): void => {
  window.sessionStorage.setItem(sessionExpiredStorageKey, "1");
};

export const consumeSessionExpired = (): boolean => {
  const expired = window.sessionStorage.getItem(sessionExpiredStorageKey) === "1";
  window.sessionStorage.removeItem(sessionExpiredStorageKey);
  return expired;
};

export const getAuthReasonParam = (search: string): AuthRedirectReason | null => {
  const reason = new URLSearchParams(search).get("reason");

  if (reason === "checkout" || reason === "session_expired") {
    return reason;
  }

  return null;
};

export const resolveAuthRedirectReason = (targetPath: string): AuthRedirectReason | undefined => {
  if (consumeSessionExpired()) {
    return "session_expired";
  }

  if (targetPath.startsWith("/checkout") || targetPath.startsWith("/orders")) {
    return "checkout";
  }

  return undefined;
};

export const getCustomerAuthInfoMessage = (
  reason: AuthRedirectReason | null,
  redirect: string | null,
): string | null => {
  if (reason === "session_expired") {
    return customerAuthMessages.sessionExpired;
  }

  if (redirect?.startsWith("/orders")) {
    return customerAuthMessages.ordersSignIn;
  }

  if (reason === "checkout" || redirect?.startsWith("/checkout")) {
    return customerAuthMessages.checkoutSignIn;
  }

  return null;
};

export const buildAuthQueryString = (redirect: string | null, reason?: AuthRedirectReason | null): string => {
  const params = new URLSearchParams();

  if (redirect) {
    params.set("redirect", redirect);
  }

  if (reason) {
    params.set("reason", reason);
  }

  const query = params.toString();
  return query ? `?${query}` : "";
};

export const getRedirectParam = (search: string): string | null => {
  const redirect = new URLSearchParams(search).get("redirect");

  if (!redirect || !isSafeRedirectPath(redirect)) {
    return null;
  }

  return redirect;
};

export const persistAuthRedirect = (path: string): void => {
  if (!isSafeRedirectPath(path)) {
    return;
  }

  window.sessionStorage.setItem(redirectStorageKey, path);
};

export const consumeAuthRedirect = (): string | null => {
  const redirect = window.sessionStorage.getItem(redirectStorageKey);
  window.sessionStorage.removeItem(redirectStorageKey);

  if (!redirect || !isSafeRedirectPath(redirect)) {
    return null;
  }

  return redirect;
};

export const resolvePostAuthRedirect = (session: AuthSession, explicitRedirect?: string | null): string => {
  if (session.user.role === "admin") {
    return adminFallbackPath;
  }

  if (explicitRedirect && isSafeRedirectPath(explicitRedirect)) {
    return explicitRedirect;
  }

  return consumeAuthRedirect() ?? publicFallbackPath;
};

export const buildLoginRedirectPath = (targetPath: string, reason?: AuthRedirectReason): string => {
  const redirect = isSafeRedirectPath(targetPath) ? targetPath : publicFallbackPath;
  const params = new URLSearchParams({ redirect });

  if (reason) {
    params.set("reason", reason);
  }

  return `/login?${params.toString()}`;
};

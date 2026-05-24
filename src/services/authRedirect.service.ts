import type { AuthSession } from "@/services/auth.service";

const redirectStorageKey = "bliss-bouquet:auth-redirect:v1";

const publicFallbackPath = "/";
const adminFallbackPath = "/admin";

const blockedRedirectPrefixes = ["/login", "/signup"];

const isSafeRedirectPath = (path: string): boolean => {
  if (!path.startsWith("/") || path.startsWith("//")) {
    return false;
  }

  return !blockedRedirectPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}?`));
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

export const buildLoginRedirectPath = (targetPath: string): string => {
  const redirect = isSafeRedirectPath(targetPath) ? targetPath : publicFallbackPath;
  return `/login?redirect=${encodeURIComponent(redirect)}`;
};

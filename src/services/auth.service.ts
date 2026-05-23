export type AuthRole = "customer" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: AuthRole;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  expiresAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthService {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  logout(): Promise<void>;
  getCurrentSession(): Promise<AuthSession | null>;
  requireAdminSession(): Promise<AuthSession>;
}

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  throw new Error("Not implemented");
}

export async function logout(): Promise<void> {
  throw new Error("Not implemented");
}

export async function getCurrentSession(): Promise<AuthSession | null> {
  throw new Error("Not implemented");
}

export async function requireAdminSession(): Promise<AuthSession> {
  throw new Error("Not implemented");
}

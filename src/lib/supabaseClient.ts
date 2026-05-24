import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type SupabaseEnvVar = "VITE_SUPABASE_URL" | "VITE_SUPABASE_ANON_KEY";

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  missingEnvVars: SupabaseEnvVar[];
  hasValidUrl: boolean;
  urlHost?: string;
}

export interface SupabaseConnectionVerification extends SupabaseConfigStatus {
  clientReady: boolean;
}

interface SupabaseEnv {
  url: string;
  anonKey: string;
}

let supabaseClient: SupabaseClient | null = null;

const readSupabaseEnv = (): SupabaseEnv => ({
  url: import.meta.env.VITE_SUPABASE_URL?.trim() ?? "",
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? "",
});

const getMissingEnvVars = ({ url, anonKey }: SupabaseEnv): SupabaseEnvVar[] => {
  const missingEnvVars: SupabaseEnvVar[] = [];

  if (!url) {
    missingEnvVars.push("VITE_SUPABASE_URL");
  }

  if (!anonKey) {
    missingEnvVars.push("VITE_SUPABASE_ANON_KEY");
  }

  return missingEnvVars;
};

export const getSupabaseConfigStatus = (): SupabaseConfigStatus => {
  const env = readSupabaseEnv();
  const missingEnvVars = getMissingEnvVars(env);
  const parsedUrl = parseSupabaseUrl(env.url);

  return {
    isConfigured: missingEnvVars.length === 0 && Boolean(parsedUrl),
    missingEnvVars,
    hasValidUrl: Boolean(parsedUrl),
    urlHost: parsedUrl?.host,
  };
};

const parseSupabaseUrl = (url: string): URL | null => {
  if (!url) {
    return null;
  }

  try {
    return new URL(url);
  } catch {
    return null;
  }
};

export const getSupabaseClient = (): SupabaseClient => {
  const env = readSupabaseEnv();
  const missingEnvVars = getMissingEnvVars(env);
  const parsedUrl = parseSupabaseUrl(env.url);

  if (missingEnvVars.length > 0) {
    throw new Error(`Supabase environment is not configured. Missing: ${missingEnvVars.join(", ")}`);
  }

  if (!parsedUrl) {
    throw new Error("Supabase environment is not configured. VITE_SUPABASE_URL must be a valid URL.");
  }

  if (!supabaseClient) {
    supabaseClient = createClient(env.url, env.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return supabaseClient;
};

export const verifySupabaseConnectionConfig = async (): Promise<SupabaseConnectionVerification> => {
  const status = getSupabaseConfigStatus();

  if (!status.isConfigured) {
    return {
      ...status,
      clientReady: false,
    };
  }

  getSupabaseClient();

  return {
    ...status,
    clientReady: true,
  };
};

import { getSupabaseClient, getSupabaseConfigStatus } from "@/lib/supabaseClient";

export interface SupabaseConnectionTestResult {
  connected: boolean;
  reason?: string;
}

export async function testSupabaseConnection(): Promise<SupabaseConnectionTestResult> {
  try {
    const configStatus = getSupabaseConfigStatus();

    if (!configStatus.isConfigured) {
      const reason = configStatus.missingEnvVars.length > 0
        ? `Missing environment variables: ${configStatus.missingEnvVars.join(", ")}`
        : "VITE_SUPABASE_URL is not a valid URL.";

      console.error("SUPABASE ERROR", reason);
      return {
        connected: false,
        reason,
      };
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("products").select("*").limit(1);

    if (error) {
      console.error("SUPABASE ERROR", error.message, error);
      return {
        connected: false,
        reason: error.message,
      };
    }

    console.log("SUPABASE CONNECTED", {
      host: configStatus.urlHost,
      rowsReturned: data?.length ?? 0,
    });

    return {
      connected: true,
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown Supabase connection error.";
    console.error("SUPABASE ERROR", reason, error);

    return {
      connected: false,
      reason,
    };
  }
}

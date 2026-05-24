/**
 * Verifies product-images bucket + storage policies (STORAGE_POLICIES.md).
 * Reads VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from .env (no secrets logged).
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const BUCKET = "product-images";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "../..");

const loadEnv = () => {
  const envPath = resolve(root, ".env");
  if (!existsSync(envPath)) {
    throw new Error("Missing .env — set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
  }
  const vars = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    vars[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
  }
  return vars;
};

const fail = (message) => {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
};

const ok = (message) => {
  console.log(`OK: ${message}`);
};

const warn = (message) => {
  console.warn(`WARN: ${message}`);
};

const env = loadEnv();
const url = env.VITE_SUPABASE_URL;
const anonKey = env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  fail("VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env");
  process.exit(1);
}

const supabase = createClient(url, anonKey);

console.log("--- Bliss Bouquet storage verification ---\n");

// 1. Bucket — listBuckets often empty with anon; confirm via public URL instead
let bucketListed = false;
const { data: buckets, error: listError } = await supabase.storage.listBuckets();

if (listError) {
  warn(`listBuckets: ${listError.message} (normal with anon key).`);
} else {
  const bucket = buckets?.find((b) => b.id === BUCKET || b.name === BUCKET);
  if (bucket) {
    bucketListed = true;
    ok(`Bucket "${BUCKET}" listed (public: ${bucket.public === true ? "yes" : "NO — enable Public bucket"})`);
    if (bucket.public !== true) {
      fail("Bucket must be public for storefront image URLs.");
    }
  }
}

// 2. Public URL reachable (confirms bucket id is valid on this project)
const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl("products/_verify_probe");
const probeUrl = urlData?.publicUrl;

if (!probeUrl || !probeUrl.includes(BUCKET)) {
  fail("getPublicUrl did not return a product-images URL");
} else {
  ok(`Public URL pattern: .../object/public/${BUCKET}/...`);
}

let bucketReachable = false;
try {
  const res = await fetch(probeUrl, { method: "HEAD" });
  if (res.status === 404 && res.statusText.toLowerCase().includes("bucket")) {
    fail(`Bucket "${BUCKET}" not found on project — create it in Dashboard.`);
  } else if (res.status === 400 || res.status === 404) {
    bucketReachable = true;
    ok(`Public bucket reachable (HEAD ${res.status}; object missing is OK)`);
  } else if (res.ok) {
    bucketReachable = true;
    ok(`Public bucket reachable (HEAD ${res.status})`);
  } else {
    warn(`Public bucket HEAD returned ${res.status} — confirm Public bucket is ON`);
  }
} catch (e) {
  warn(`Could not HEAD public URL: ${e instanceof Error ? e.message : String(e)}`);
}

if (!bucketListed && !bucketReachable) {
  fail(`Could not confirm bucket "${BUCKET}". Create it: Storage → Buckets → public ON.`);
}

// 3. Anon upload must be denied (policy sanity)
const probeFile = new Blob([new Uint8Array([0xff, 0xd8, 0xff, 0xd9])], { type: "image/jpeg" });
const { error: uploadError } = await supabase.storage
  .from(BUCKET)
  .upload(`products/_verify-${Date.now()}.txt`, probeFile, { upsert: false });

if (!uploadError) {
  warn("Anonymous upload succeeded — INSERT policy may be too permissive.");
} else if (
  uploadError.message.toLowerCase().includes("row-level security") ||
  uploadError.message.toLowerCase().includes("policy") ||
  uploadError.message.toLowerCase().includes("not allowed") ||
  uploadError.message.toLowerCase().includes("unauthorized") ||
  uploadError.message.toLowerCase().includes("403")
) {
  ok(`Anonymous upload blocked (${uploadError.message})`);
} else {
  warn(`Anonymous upload error: ${uploadError.message}`);
}

console.log("\n--- Policies (run in SQL Editor) ---");
console.log(`select id, name, public from storage.buckets where id = '${BUCKET}';`);
console.log(`select policyname, cmd from pg_policies
where schemaname = 'storage' and tablename = 'objects'
  and (policyname like 'bbk_storage_%' or policyname ilike '%product%')
order by policyname;`);
console.log("\nExpected 4 policies (bbk_storage_* names) for admin upload/delete.");
console.log("If missing, add them via Dashboard — see supabase/STORAGE_POLICIES.md Step 2.\n");

if (process.exitCode === 1) {
  process.exit(1);
}

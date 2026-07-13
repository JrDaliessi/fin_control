export type SupabasePublicConfig = {
  key: string;
  url: string;
};

type SupabasePublicEnvironment = {
  anonKey?: string;
  publishableKey?: string;
  url?: string;
};

function normalizeOptionalValue(value: string | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function normalizeUrl(value: string | undefined) {
  const normalized = normalizeOptionalValue(value);

  if (!normalized) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
  }

  try {
    const url = new URL(normalized);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("unsupported protocol");
    }

    return url.toString();
  } catch {
    throw new Error(
      "Invalid environment variable: NEXT_PUBLIC_SUPABASE_URL must be a valid HTTP or HTTPS URL"
    );
  }
}

export function resolveSupabasePublicConfig(
  environment: SupabasePublicEnvironment
): SupabasePublicConfig {
  const key =
    normalizeOptionalValue(environment.publishableKey) ??
    normalizeOptionalValue(environment.anonKey);

  if (!key) {
    throw new Error(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return {
    key,
    url: normalizeUrl(environment.url)
  };
}

export function getSupabasePublicConfig(): SupabasePublicConfig {
  return resolveSupabasePublicConfig({
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL
  });
}

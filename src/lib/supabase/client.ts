import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "./config";

export function createSupabaseBrowserClient() {
  const { key, url } = getSupabasePublicConfig();

  return createBrowserClient(url, key);
}

import {
  createServerClient,
  type CookieOptions
} from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { resolveAuthRoute } from "@/features/auth/application/policies/auth-route-policy";
import {
  getSupabasePublicConfig,
  resolveSupabasePublicConfig
} from "./config";

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

type ProxyClient = {
  auth: {
    getClaims(): Promise<{
      data: { claims: { sub?: string } | null } | null;
      error: unknown | null;
    }>;
  };
};

type ProxyClientFactory = (
  url: string,
  key: string,
  options: {
    cookies: {
      getAll(): Array<{ name: string; value: string }>;
      setAll(
        cookies: CookieToSet[],
        responseHeaders?: Record<string, string>
      ): void;
    };
  }
) => ProxyClient;

type UpdateSupabaseSessionDependencies = {
  createServerClient?: ProxyClientFactory;
  supabaseUrl?: string;
  supabaseKey?: string;
};

export async function updateSupabaseSession(
  request: NextRequest,
  dependencies: UpdateSupabaseSessionDependencies = {}
) {
  let response = NextResponse.next({ request });
  let sessionHeaders: Record<string, string> = {};
  const factory: ProxyClientFactory =
    dependencies.createServerClient ??
    ((url, key, options) => createServerClient(url, key, options));

  let isAuthenticated = false;

  try {
    const config =
      dependencies.supabaseUrl !== undefined ||
      dependencies.supabaseKey !== undefined
        ? resolveSupabasePublicConfig({
            publishableKey: dependencies.supabaseKey,
            url: dependencies.supabaseUrl
          })
        : getSupabasePublicConfig();
    const supabase = factory(
      config.url,
      config.key,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet, responseHeaders) {
            sessionHeaders = { ...(responseHeaders ?? {}) };
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });

            response = NextResponse.next({ request });

            Object.entries(sessionHeaders).forEach(([name, value]) => {
              response.headers.set(name, value);
            });

            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          }
        }
      }
    );

    const { data, error } = await supabase.auth.getClaims();
    isAuthenticated = !error && Boolean(data?.claims?.sub);
  } catch {
    isAuthenticated = false;
  }

  const decision = resolveAuthRoute({
    pathname: request.nextUrl.pathname,
    isAuthenticated
  });

  if (decision.action === "allow") {
    return response;
  }

  const redirectResponse = NextResponse.redirect(
    new URL(decision.destination, request.url)
  );

  Object.entries(sessionHeaders).forEach(([name, value]) => {
    redirectResponse.headers.set(name, value);
  });
  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  return redirectResponse;
}

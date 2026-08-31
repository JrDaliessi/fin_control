const commonSecurityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY"
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff"
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin"
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()"
  }
];

function resolveSupabaseOrigin() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (!value) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "https:") {
      throw new Error("unsupported protocol");
    }

    return url.origin;
  } catch {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must be a valid HTTPS URL"
    );
  }
}

function buildContentSecurityPolicy(supabaseOrigin, isProduction) {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
    "object-src 'none'",
    "manifest-src 'self'",
    "font-src 'self'",
    "img-src 'self' data: blob:",
    "worker-src 'self' blob:",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    `connect-src 'self' ${supabaseOrigin}`,
    ...(isProduction ? ["upgrade-insecure-requests"] : [])
  ].join("; ");
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    const isProduction = process.env.VERCEL_ENV === "production";
    const contentSecurityPolicy = buildContentSecurityPolicy(
      resolveSupabaseOrigin(),
      isProduction
    );
    const headers = [
      ...commonSecurityHeaders,
      {
        key: "Content-Security-Policy",
        value: contentSecurityPolicy
      },
      ...(isProduction
        ? [
            {
              key: "Strict-Transport-Security",
              value: "max-age=63072000; includeSubDomains; preload"
            }
          ]
        : [])
    ];

    return [
      {
        source: "/:path*",
        headers
      }
    ];
  }
};

export default nextConfig;

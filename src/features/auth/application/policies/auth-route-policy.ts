type ResolveAuthRouteInput = {
  pathname: string;
  isAuthenticated: boolean;
};

export type AuthRouteDecision =
  | { action: "allow" }
  | { action: "redirect"; destination: "/dashboard" | "/login" };

export function resolveAuthRoute({
  pathname,
  isAuthenticated
}: ResolveAuthRouteInput): AuthRouteDecision {
  if (pathname === "/login") {
    return isAuthenticated
      ? { action: "redirect", destination: "/dashboard" }
      : { action: "allow" };
  }

  return isAuthenticated
    ? { action: "allow" }
    : { action: "redirect", destination: "/login" };
}

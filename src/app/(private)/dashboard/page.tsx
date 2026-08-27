import {
  composeDashboardRoute,
  type DashboardRouteProps
} from "./compose-dashboard-route";

export default function DashboardRoutePage(props: DashboardRouteProps) {
  return composeDashboardRoute(props);
}

import {
  composeDashboardRoute,
  type DashboardRouteProps
} from "./dashboard/compose-dashboard-route";

export default function HomePage(props: DashboardRouteProps) {
  return composeDashboardRoute(props);
}

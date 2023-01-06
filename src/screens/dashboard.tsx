import { PortalRoute } from './routeTypes';

function Dashboard() {
  return <div>Welcome to your UID2 dashboard!</div>;
}
export const DashboardRoute: PortalRoute = {
  path: '/',
  description: 'Dashboard',
  element: <Dashboard />,
};

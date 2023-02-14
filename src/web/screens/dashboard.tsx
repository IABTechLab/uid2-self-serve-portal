import { useContext } from 'react';

import { CurrentUserContext } from '../services/userAccount';
import { PortalRoute } from './routeTypes';

function Dashboard() {
  const { LoggedInUser } = useContext(CurrentUserContext);
  if (LoggedInUser === null) return <div>Not logged in!</div>;
  return (
    <div>
      <div>Welcome to your UID2 dashboard!</div>
      <div>
        Hi, {LoggedInUser.name}! Your email address is {LoggedInUser.email}
      </div>
    </div>
  );
}
export const DashboardRoute: PortalRoute = {
  path: '/',
  description: 'Dashboard',
  element: <Dashboard />,
};

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@radix-ui/react-navigation-menu';
import { NavLink, useParams } from 'react-router-dom';

import config from '../../../../package.json';
import { PortalRoute } from '../../screens/routeUtils';
import { getPathWithParticipant } from '../../utils/urlHelpers';
import { ParticipantSwitcher } from './ParticipantSwitcher';

import './SideNav.scss';

function MenuItem({
  path,
  description,
  linkClass,
  isHidden,
}: Pick<PortalRoute, 'path' | 'description' | 'isHidden'> & { linkClass?: string }) {
  const { participantId } = useParams();
  const pathWithParticipant = getPathWithParticipant(path, participantId);

  return (
    <NavigationMenuItem
      key={pathWithParticipant}
      className={`side-nav-item ${isHidden ? 'hidden' : ''}`}
    >
      <NavLink to={pathWithParticipant} className={linkClass}>
        {description}
      </NavLink>
    </NavigationMenuItem>
  );
}

export type SideNavProps = Readonly<{
  standardMenu: PortalRoute[];
  uid2SupportMenu: PortalRoute[];
}>;
export function SideNav({ standardMenu, uid2SupportMenu }: SideNavProps) {
  return (
    <NavigationMenu className='side-nav'>
      <NavigationMenuList className='main-nav'>
        <ParticipantSwitcher />
        <div className='side-nav-divider' />
        {standardMenu
          .filter((m) => (m.location ?? 'default') === 'default')
          .map((m) => MenuItem(m))}
        {uid2SupportMenu.length > 0 && (
          <>
            <div className='side-nav-divider' />
            {uid2SupportMenu
              .filter((m) => (m.location ?? 'default') === 'default')
              .map((m) => MenuItem(m))}
          </>
        )}
      </NavigationMenuList>
      <NavigationMenuList className='nav-footer'>
        <NavigationMenuItem className='side-nav-item portal-documentation-link'>
          <a
            target='_blank'
            className='outside-link'
            href='https://unifiedid.com/docs/category/uid2-portal'
            rel='noreferrer'
          >
            UID2 Portal Documentation
          </a>
        </NavigationMenuItem>
        <div className='side-nav-divider' />
        <li className='side-nav-item'>&copy; 2024 Unified ID</li>
        <NavigationMenuItem className='side-nav-item'>
          <a
            target='_blank'
            className='outside-link'
            href='https://www.thetradedesk.com/us/website-privacy-policy'
            rel='noreferrer'
          >
            Website Privacy Policy
          </a>
        </NavigationMenuItem>
        {standardMenu
          .filter((m) => m.location === 'footer')
          .map((m) => (
            <MenuItem
              key={m.path}
              path={m.path}
              description={m.description}
              linkClass='outside-link'
            />
          ))}
        <li className='side-nav-item version-info'>UID2 Portal v.{config.version}</li>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

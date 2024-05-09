import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@radix-ui/react-navigation-menu';
import { NavLink } from 'react-router-dom';

import config from '../../../../package.json';
import { PortalRoute } from '../../screens/routeUtils';

import './SideNav.scss';

function MenuItem({
  path,
  description,
  linkClass,
  isHidden,
}: Pick<PortalRoute, 'path' | 'description' | 'isHidden'> & { linkClass?: string }) {
  return (
    <NavigationMenuItem key={path} className={`side-nav-item ${isHidden ? 'hidden' : ''}`}>
      <NavLink to={path} className={linkClass}>
        {description}
      </NavLink>
    </NavigationMenuItem>
  );
}
export type SideNavProps = {
  standardMenu: PortalRoute[];
  adminMenu: PortalRoute[];
};
export function SideNav({ standardMenu, adminMenu }: SideNavProps) {
  return (
    <NavigationMenu className='side-nav'>
      <NavigationMenuList className='main-nav'>
        {standardMenu
          .filter((m) => (m.location ?? 'default') === 'default')
          .map((m) => MenuItem(m))}
        {adminMenu.length > 0 && (
          <>
            <div className='side-nav-divider' />
            {adminMenu
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
            href='http://unifiedid.com/docs/getting-started/gs-sharing'
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

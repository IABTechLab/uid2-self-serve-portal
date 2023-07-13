import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@radix-ui/react-navigation-menu';
import { NavLink } from 'react-router-dom';

import { PortalRoute } from '../../screens/routeUtils';

import './SideNav.scss';

function MenuItem({
  path,
  description,
  linkClass,
}: Pick<PortalRoute, 'path' | 'description'> & { linkClass?: string }) {
  return (
    <NavigationMenuItem key={path} className='side-nav-item'>
      <NavLink to={path} className={linkClass}>
        {description}
      </NavLink>
    </NavigationMenuItem>
  );
}
export type SideNavProps = {
  menu: PortalRoute[];
};
export function SideNav({ menu }: SideNavProps) {
  return (
    <NavigationMenu className='side-nav'>
      <NavigationMenuList>
        {menu.filter((m) => (m.location ?? 'default') === 'default').map((m) => MenuItem(m))}
      </NavigationMenuList>
      <NavigationMenuList className='nav-footer'>
        <li className='side-nav-item'>&copy; 2023 Unified ID</li>
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
        {menu
          .filter((m) => m.location === 'footer')
          .map((m) => (
            <MenuItem path={m.path} description={m.description} linkClass='outside-link' />
          ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

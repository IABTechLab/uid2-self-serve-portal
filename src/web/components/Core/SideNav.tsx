import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@radix-ui/react-navigation-menu';
import { NavLink } from 'react-router-dom';

import { PortalRoute } from '../../screens/routeUtils';

import './SideNav.scss';

function MenuItem({ path, description }: PortalRoute) {
  return (
    <NavigationMenuItem key={path}>
      <NavLink to={path}>{description}</NavLink>
    </NavigationMenuItem>
  );
}
export type SideNavProps = {
  menu: PortalRoute[];
};
export function SideNav({ menu }: SideNavProps) {
  return (
    <NavigationMenu className='side-nav'>
      <NavigationMenuList>{menu.map((m) => MenuItem(m))}</NavigationMenuList>
    </NavigationMenu>
  );
}

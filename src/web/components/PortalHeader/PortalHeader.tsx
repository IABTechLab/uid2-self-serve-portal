import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar } from '@radix-ui/react-avatar';
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import * as Switch from '@radix-ui/react-switch';
import MD5 from 'crypto-js/md5';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { EmailContactsRoute } from '../../screens/emailContacts';
import { ParticipantInformationRoute } from '../../screens/participantInformation';
import { TeamMembersRoute } from '../../screens/teamMembers';

import './PortalHeader.scss';

export type PortalHeaderProps = {
  email: string | undefined;
  fullName: string | undefined;
  setDarkMode?: (darkMode: boolean) => void;
  logout: () => void;
};

export function PortalHeader({
  email,
  fullName,
  setDarkMode = undefined,
  logout,
}: Readonly<PortalHeaderProps>) {
  const emailMd5 = email ? MD5(email).toString() : null;
  const routes = [ParticipantInformationRoute, TeamMembersRoute, EmailContactsRoute];

  const [menuOpen, setMenuOpen] = useState(false);

  const handleSelect = () => {
    setMenuOpen(false);
  };

  const [darkToggleState, setDarkToggleState] = useState(false);
  const onThemeToggle = () => {
    setDarkToggleState(!darkToggleState);
  };
  useEffect(() => {
    setDarkMode?.(darkToggleState);
  }, [darkToggleState, setDarkMode]);

  return (
    <header className='portal-header'>
      <div className='title'>
        <Link data-testid='title-link' to='/'>
          <img
            src={darkToggleState ? '/uid2-logo-darkmode.svg' : '/uid2-logo.svg'}
            alt='UID2 logo'
            className='uid2-logo'
          />
        </Link>
      </div>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger className='profile-dropdown-button'>
          {email ? fullName : 'Not logged in'}
          <FontAwesomeIcon icon='chevron-down' />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='profile-dropdown-content' align='end'>
          <DropdownMenuArrow className='profile-dropdown-arrow' />
          <div className='portal-avatar-container'>
            <Avatar className='portal-avatar' asChild>
              {!!email && (
                <img src={`//www.gravatar.com/avatar/${emailMd5}.jpg`} alt='Profile avatar' />
              )}
            </Avatar>
          </div>
          <DropdownMenuSeparator className='separator' />
          {routes.map((route) => {
            return (
              <DropdownMenuItem
                key={route.path}
                className='dropdown-menu-item'
                onClick={handleSelect}
              >
                <Link to={route.path} className='link'>
                  {route.description}
                </Link>
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
            <div className='theme-switch'>
              <label htmlFor='dark-mode'>Dark Mode</label>
              <Switch.Root
                name='dark-mode'
                checked={darkToggleState}
                onCheckedChange={onThemeToggle}
                className='theme-toggle clickable-item'
              >
                <Switch.Thumb className='thumb' />
              </Switch.Root>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className='separator' />
          <DropdownMenuItem className='dropdown-menu-item' onClick={logout}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
